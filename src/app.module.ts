import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventReaderService } from './event-reader/event.reader.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event-db/event.entity';
import { DataSource } from 'typeorm';
import { EventProcessorService } from './event-processor/event.processor.service';
import { EventDbService } from './event-db/event.db.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [Event],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventDbService,
    EventReaderService,
    EventProcessorService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
