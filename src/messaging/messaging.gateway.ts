import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from './messaging.service';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessageDirection } from './models/message.model';


@WebSocketGateway({
    namespace: '/messages',
    cors: {
        origin: '*', // restrict in prod
        methods: ['GET', 'POST'],
    },
})
@Injectable()
export class MessagingGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('MessagingGateway');

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private messagingService: MessagingService,
    ) { }

    async afterInit(server: any) {
        // 1️⃣ Create raw Socket.IO server
        this.server = new Server({
            cors: { origin: '*' },
        });
        // setup redis adapter for scaling
        const redisUrl = this.configService.get<string>('REDIS_URL') ?? `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`;
        const pubClient = createClient({ url: redisUrl });
        const subClient = pubClient.duplicate();
        await pubClient.connect();
        await subClient.connect();

        // Cast NestJS server to Socket.IO Server
        this.server.adapter(createAdapter(pubClient, subClient));
        this.logger.log('Redis adapter configured for socket.io');
    }

    async handleConnection(client: Socket) {
        try {
            const token = this.getTokenFromClient(client);
            if (!token) throw new UnauthorizedException('No token');

            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            // attach auth info
            (client as any).user = payload;
            const userId = payload.sub ?? payload.userId ?? payload.id;
            if (!userId) throw new UnauthorizedException('Invalid token payload');

            // join a room that represents this user so we can emit directly
            const room = `user:${userId}`;
            await client.join(room);
            this.logger.log(`Client ${client.id} connected as ${userId} and joined ${room}`);
        } catch (err) {
            this.logger.warn(`Connection rejected: ${(err as Error).message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    private getTokenFromClient(client: Socket): string | null {
        // check query param, then auth header
        const tokenFromQuery = (client.handshake.query && (client.handshake.query.token as string)) ?? null;
        if (tokenFromQuery) return tokenFromQuery;
        const authHeader = client.handshake.headers?.authorization as string;
        if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
        return null;
    }

    /**
     * Client emits 'private_message' with payload { recipientId, content, metadata }
     * Gateway saves message and emits to recipient room and sender room for ACK.
     */
    @SubscribeMessage('private_message')
    async onPrivateMessage(@MessageBody() payload: SendMessageDto, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;
        if (!user) throw new UnauthorizedException();

        // Save to DB
        const saved = await this.messagingService.saveMessage({
            senderId: user.sub ?? user.userId ?? user.id,
            recipientId: payload.recipientId,
            content: payload.content,
            metadata: payload.metadata ?? null,
            direction: determineDirection(user, payload.recipientId) as MessageDirection,
        });

        // Emit to recipient (if connected) and ack to sender
        const recipientRoom = `user:${payload.recipientId}`;
        const senderRoom = `user:${saved.senderId}`;

        // Payload to emit
        const emitPayload = {
            id: saved.id,
            senderId: saved.senderId,
            recipientId: saved.recipientId,
            content: saved.content,
            createdAt: saved.createdAt,
            isRead: saved.isRead,
            metadata: saved.metadata,
        };

        // Send to recipient
        this.server.to(recipientRoom).emit('message', emitPayload);

        // Ack to sender
        client.emit('message_sent', emitPayload);

        return { ok: true, message: emitPayload };
    }

    /**
     * Admin can mark messages read
     */
    @SubscribeMessage('mark_read')
    async onMarkRead(@MessageBody() payload: { senderId: string }, @ConnectedSocket() client: Socket) {
        const user = (client as any).user;
        if (!user) throw new UnauthorizedException();

        const recipientId = user.sub ?? user.userId ?? user.id;
        await this.messagingService.markAsRead(recipientId, payload.senderId);

        // Notify sender client(s) that messages are read
        const senderRoom = `user:${payload.senderId}`;
        this.server.to(senderRoom).emit('messages_read', { by: recipientId, from: payload.senderId });
        return { ok: true };
    }
}

/**
 * Helper: determine message direction based on roles/ids.
 * For demo, assume payload.user has 'roles' array.
 */
function determineDirection(user: any, recipientId: string) {
    const roles: string[] = user?.roles ?? [];
    if (roles.includes('superadmin')) return 'from_superadmin';
    if (roles.includes('admin')) return 'from_admin';
    return 'from_user';
}
