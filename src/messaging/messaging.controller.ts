import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,
    Param,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetConversationDto } from './dtos/get-conversation.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { EnumRoles } from 'src/users/enums/roles.enum';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagingController {
    constructor(private readonly messagingService: MessagingService) { }

    @Get('inbox')
    async inbox(@Query('limit') limit = 50) {
        return this.messagingService.listRecentForAdmin(Number(limit));
    }

    @Get('conversation/:participantId')
    async conversation(@Req() req: any, @Param() params: GetConversationDto) {
        // req.user.userId must be set by JwtAuthGuard
        const userId = req.user?.userId;

        const page = Number((params as any).page) || 1;
        const pageSize = Number((params as any).pageSize) || 50;
        const participantId = (params as any).participantId;
        // admin user id should come from req.user; for simplicity we assume admin id provided or fetched
        // In real code: const adminId = req.user.userId;
        return this.messagingService.getConversation(userId, participantId, page, pageSize);
    }

    @Post('send')
    async send(@Body() dto: SendMessageDto, @Req() req: any) {
        // req.user.userId must be set by JwtAuthGuard
        const senderId = req.user?.id;
        const saved = await this.messagingService.saveMessage({
            senderId,
            recipientId: dto.recipientId,
            content: dto.content,
            metadata: dto.metadata ?? null,
        });

        // Gateway will pick this up or you can emit via service (Gateway is separate)
        return saved;
    }

    @Roles(EnumRoles.ADMIN, EnumRoles.SUPERADMIN)
    @Get('admin/conversation/:participantId')
    async adminConversation(@Req() req: any, @Param() params: GetConversationDto) {
        const page = Number((params as any).page) || 1;
        const pageSize = Number((params as any).pageSize) || 50;
        const participantId = (params as any).participantId;
        const adminId = req.user.id;
        return this.messagingService.getConversation(adminId, participantId, page, pageSize);
    }
}
