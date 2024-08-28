// src/kafka/kafka.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'chat-app',
    brokers: ['localhost:9092'],
  });

  private producer: Producer;
  private consumer: Consumer;

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();

    this.consumer = this.kafka.consumer({ groupId: 'chat-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'chat-topic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
      },
    });
  }

  async sendMessage(message: string) {
    await this.producer.send({
      topic: 'chat-topic',
      messages: [{ value: message }],
    });
  }
}
