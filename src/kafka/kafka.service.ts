import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) { }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('chat-topic');
    await this.kafkaClient.connect();
  }

  async sendMessage(message: string) {
    await this.kafkaClient.emit('chat-topic', { message });
  }
}
