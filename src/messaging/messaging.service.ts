import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Message, MessageDirection } from './models/message.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Op } from 'sequelize';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  /**
   * Save a message to DB
   */
  async saveMessage(payload: {
    senderId: string;
    recipientId: string;
    content: string;
    direction?: MessageDirection;
    metadata?: object | null;
  }) {
    const msg = await this.messageModel.create({
      senderId: payload.senderId,
      recipientId: payload.recipientId,
      content: payload.content,
      direction: payload.direction ?? MessageDirection.FROM_USER,
      metadata: payload.metadata ?? null,
      isRead: false,
    } as Message);
    return msg;
  }

  /**
   * Mark messages in conversation as read (recipient perspective)
   */
  async markAsRead(recipientId: string, senderId: string) {
    await this.messageModel.update(
      { isRead: true },
      { where: { recipientId, senderId, isRead: false } },
    );
  }

  /**
   * Get paginated conversation between two users (user or admin)
   */
  async getConversation(userA: string, userB: string, page = 1, pageSize = 50) {
    const offset = (page - 1) * pageSize;
    const { rows, count } = await this.messageModel.findAndCountAll({
      where: {
        // messages where (sender=userA and recipient=userB) OR (sender=userB and recipient=userA)
        [Op.or]: [
          { senderId: userA, recipientId: userB },
          { senderId: userB, recipientId: userA },
        ],
      },
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset,
    } as any);
    return {
      total: count,
      page,
      pageSize,
      messages: rows.reverse(), // return oldest-first
    };
  }

  /**
   * Quick list of last messages per conversation for admin listing (inbox)
   * This is a simple implementation; consider optimized queries for production.
   */
  async listRecentForAdmin(limit = 100) {
    // return last message per conversation where recipient or sender != admin? keep simple: last N messages
    return this.messageModel.findAll({
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}
