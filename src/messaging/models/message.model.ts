import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';

export enum MessageDirection {
  FROM_USER = 'from_user',
  FROM_ADMIN = 'from_admin',
  FROM_SUPERADMIN = 'from_superadmin',
}

@Table({
  tableName: 'messages',
  timestamps: true,
  paranoid: true,
})
export class Message extends Model<Message> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  // sender (user or admin)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  senderId: string;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  // recipient (user or admin)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  recipientId: string;

  @BelongsTo(() => User, 'recipientId')
  recipient: User;

  @Column({ type: DataType.TEXT, allowNull: false })
  content: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRead: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(MessageDirection)),
    defaultValue: MessageDirection.FROM_USER,
  })
  direction: MessageDirection;

  // optional metadata for admin (attachment links, booking refs, etc.)
  @Column({ type: DataType.JSONB, allowNull: true })
  metadata: object | null;
}
