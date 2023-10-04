import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventReaderService } from './event-reader/event-reader.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventReaderService = app.get(EventReaderService);
  eventReaderService.readPastEvents();
}
bootstrap();
