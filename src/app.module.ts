import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventReaderService } from './event-reader/event-reader.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event-reader/event.entity';
import { EventSaverService } from './event-reader/event-saver.service';
import { DataSource } from 'typeorm';

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
  providers: [AppService, EventSaverService, EventReaderService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
