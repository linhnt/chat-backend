import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { KafkaService } from 'src/kafka/kafka.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kafkaService: KafkaService) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    await this.kafkaService.sendMessage(message);
    this.server.emit('receiveMessage', message);
  }
}
