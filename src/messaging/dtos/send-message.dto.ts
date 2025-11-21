import { IsUUID, IsString, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  recipientId: string;

  @IsString()
  content: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
