import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BatchChatRepository } from './repositories/batchChat.repository';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BatchRepository } from '../admin/repositories/batchRepository';
import { Types } from 'mongoose';

@Injectable()
@WebSocketGateway({ cors: true })
export class SocketIoGateway {
  @WebSocketServer()
  private server: Server;

  private typingUsers: Map<string, Map<string, string>> = new Map();

  constructor(
    private readonly batchChatRepository: BatchChatRepository,
    private readonly batchRepository: BatchRepository,
  ) {}

  @SubscribeMessage('joinBatchChat')
  async handleJoinBatchChat(client: Socket, payload: { batchId: string }) {
    const { batchId } = payload;

    if (!Types.ObjectId.isValid(batchId)) {
      client.emit('error', { message: 'Invalid batchId' });
      return;
    }

    const objectIdBatchId = new Types.ObjectId(batchId);
    await client.join(batchId);

    try {
      const batchDetails = await this.batchRepository.findByBatchId(objectIdBatchId);
      client.emit('batchDetails', batchDetails);

      const messages = await this.batchChatRepository.getMessagesByBatchId(batchId);
      client.emit('messageHistory', messages);

      this.broadcastTypingUsers(batchId);
    } catch (error) {
      client.emit('error', { message: 'Failed to join batch chat' });
      console.error('Error joining batch chat:', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { text: string; batchId: string; role: 'student' | 'teacher'; userId: string }) {
    const { text, batchId, role, userId } = payload;

    try {
      const message = await this.batchChatRepository.createMessage(text, batchId, userId, role);
      const populatedMessage = await this.batchChatRepository.populateMessage(message);
      this.server.to(batchId).emit('message', populatedMessage);

      this.removeTypingUser(batchId, userId);
      this.broadcastTypingUsers(batchId);
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
      console.error('Error sending message:', error);
    }
  }

  @SubscribeMessage('typingStatus')
  handleTypingStatus(client: Socket, payload: { batchId: string; userId: string; userName: string; isTyping: boolean }) {
    const { batchId, userId, userName, isTyping } = payload;
    
    if (isTyping) {
      this.addTypingUser(batchId, userId, userName);
    } else {
      this.removeTypingUser(batchId, userId);
    }
    
    this.broadcastTypingUsers(batchId);
  }

  private addTypingUser(batchId: string, userId: string, userName: string) {
    if (!this.typingUsers.has(batchId)) {
      this.typingUsers.set(batchId, new Map());
    }
    this.typingUsers.get(batchId).set(userId, userName);
  }

  private removeTypingUser(batchId: string, userId: string) {
    this.typingUsers.get(batchId)?.delete(userId);
  }

  private broadcastTypingUsers(batchId: string) {
    const typingUsers = Array.from(this.typingUsers.get(batchId)?.values() || []);
    this.server.to(batchId).emit('typingUsers', typingUsers);
  }
}