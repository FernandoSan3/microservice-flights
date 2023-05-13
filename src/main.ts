import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RabbitMQ } from './flight/common/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport : Transport.RMQ,
    options : {
      urls : [process.env.AMQP_URL],
      queue : RabbitMQ.FlightQueue
    }
  });
  await app.listen();
  console.log('Microservice is listening');
}
bootstrap();
