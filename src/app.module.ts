import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventReaderService } from './event-reader/event.reader.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event-db/event.entity';
import { Transaction } from './event-db/transaction.entity';
import { DataSource } from 'typeorm';
import { EventProcessorService } from './event-processor/event.processor.service';
import { EventDbService } from './event-db/event.db.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionDbService } from './event-db/transaction.db.service';
import { TransactionCronService } from './event-processor/transaction.cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [Event, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Event, Transaction]),
  ],
  providers: [
    AppService,
    EventDbService,
    EventReaderService,
    EventProcessorService,
    TransactionDbService,
    TransactionCronService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
