import { Injectable, } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BatchChatRepository } from './repositories/batchChat.repository';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BatchRepository } from '../admin/repositories/batchRepository';
import { Types } from 'mongoose';
import { S3Service } from 'src/aws/awsS3.service';

@Injectable()
@WebSocketGateway({ cors: true })
export class SocketIoGateway {
  @WebSocketServer()
  private server: Server;

  private typingUsers: Map<string, Map<string, string>> = new Map();
  private connectedUsers: Map<string, Set<string>> = new Map();
  private userSocketMap: Map<string, Socket> = new Map();
  private activeCalls: Map<string, { initiatorId: string; initiatorName: string; jitsiLink: string }> = new Map();


  constructor(
    private readonly batchChatRepository: BatchChatRepository,
    private readonly batchRepository: BatchRepository,
    private readonly s3Service: S3Service,
    
  ) { }

  @SubscribeMessage('joinBatchChat')
  async handleJoinBatchChat(client: Socket, payload: { batchId: string; userId: string }) {
    const { batchId, userId } = payload;

    if (!Types.ObjectId.isValid(batchId)) {
      client.emit('error', { message: 'Invalid batchId' });
      return;
    }

    const objectIdBatchId = new Types.ObjectId(batchId);
    await client.join(batchId);

    this.addConnectedUser(batchId, userId);
    this.userSocketMap.set(userId, client);

    try {
      const batchDetails = await this.batchRepository.findByBatchId(objectIdBatchId);
      client.emit('batchDetails', batchDetails);

      const messages = await this.batchChatRepository.getMessagesByBatchId(batchId);
      client.emit('messageHistory', messages);

      const activeCall = this.activeCalls.get(batchId);
      if (activeCall) {
        client.emit('videoCallStatus', {
          isActive: true,
          initiatorName: activeCall.initiatorName,
          jitsiLink: activeCall.jitsiLink
        });
      } else {
        client.emit('videoCallStatus', { isActive: false });
      }

      this.broadcastTypingUsers(batchId);
      this.broadcastConnectedUsers(batchId);
    } catch (error) {
      client.emit('error', { message: 'Failed to join batch chat' });
      console.error('Error joining batch chat:', error);
    }
  }


  @SubscribeMessage('sendMessageWithFiles')
  async handleSendMessageWithFiles(client: Socket, payload: any) {
    const { text, batchId, role, userId } = payload;
    const files = payload.files || []; // Handle files
    console.log(files);

    try {
      // Handle file uploads if present
      const fileUrls = files.length > 0 ? await Promise.all(files.map(file => this.s3Service.uploadFile(file))) : [];
      console.log('fileUrlsssssssssssssssssssssssssssss', fileUrls);

      // Create a message even if it has only text or only files
      const message = await this.batchChatRepository.createMessage(text || '', batchId, userId, role, fileUrls);
      console.log('Message created:', message);

      // Emit the new message to the batch chat
      const populatedMessage = await this.batchChatRepository.populateMessage(message);
      this.server.to(batchId).emit('message', populatedMessage);

    } catch (error) {
      console.error('Error handling sendMessageWithFiles:', error);
      client.emit('error', { message: 'Failed to send message' });
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

  @SubscribeMessage('deleteMessages')
  async handleDeleteMessages(client: Socket, payload: { messageIds: string[], batchId: string, userId: string, role: 'student' | 'teacher' }) {
    const { messageIds, batchId, userId, role } = payload;

    try {
      const deletedMessageIds = await this.batchChatRepository.deleteUserMessages(messageIds, userId, role);
      if (deletedMessageIds.length > 0) {
        this.server.to(batchId).emit('messagesDeleted', deletedMessageIds);
      } else {
        client.emit('error', { message: 'No messages were deleted. You can only delete your own messages.' });
      }
    } catch (error) {
      client.emit('error', { message: 'Failed to delete messages' });
      console.error('Error deleting messages:', error);
    }
  }

  @SubscribeMessage('startVideoCall')
  handleStartVideoCall(client: Socket, payload: { batchId: string; initiatorId: string; initiatorName: string }) {
    const { batchId, initiatorId, initiatorName } = payload;
    const role = client.handshake.query.role as string;

    if (role !== 'teacher') {
      client.emit('error', { message: 'Only teachers can start a video call' });
      return;
    }

    const jitsiLink = `https://meet.jit.si/TeacherBatchMeeting-${batchId}`;
    this.activeCalls.set(batchId, { initiatorId, initiatorName, jitsiLink });
    this.server.to(batchId).emit('videoCallStarted', { initiatorName, jitsiLink });
  }

  @SubscribeMessage('endVideoCall')
  handleEndVideoCall(client: Socket, payload: { batchId: string }) {
    const { batchId } = payload;
    const role = client.handshake.query.role as string;

    if (role !== 'teacher') {
      client.emit('error', { message: 'Only teachers can end a video call' });
      return;
    }

    this.activeCalls.delete(batchId);
    this.server.to(batchId).emit('videoCallEnded', { batchId });
  }


  handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      const batchId = this.getBatchIdFromUserId(userId);
      if (batchId) {
        this.removeConnectedUser(batchId, userId);
        this.broadcastConnectedUsers(batchId);
      }
      this.userSocketMap.delete(userId);
    }
  }

  private addConnectedUser(batchId: string, userId: string) {
    if (!this.connectedUsers.has(batchId)) {
      this.connectedUsers.set(batchId, new Set());
    }
    this.connectedUsers.get(batchId).add(userId);
    this.broadcastConnectedUsers(batchId);
  }

  private removeConnectedUser(batchId: string, userId: string) {
    console.log(`Removing user: ${userId} from batch: ${batchId}`);
    const users = this.connectedUsers.get(batchId);
    if (users) {
      users.delete(userId);
      console.log(`Users in batch ${batchId} after removal:`, Array.from(users));
      if (users.size === 0) {
        this.connectedUsers.delete(batchId);
      }
    }
  }

  private broadcastConnectedUsers(batchId: string) {
    const connectedUsers = Array.from(this.connectedUsers.get(batchId) || []);
    this.server.to(batchId).emit('connectedUsers', connectedUsers);
  }

  private getUserIdFromSocket(client: Socket): string | null {
    return client.handshake.query.userId as string || null;
  }

  private getBatchIdFromUserId(userId: string): string | null {
    for (const [batchId, users] of this.connectedUsers.entries()) {
      if (users.has(userId)) {
        return batchId;
      }
    }
    return null;
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