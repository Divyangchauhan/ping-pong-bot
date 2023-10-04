import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EventSaverService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async saveEvents(events: ethers.Event[]) {
    console.log(events);
    const eventsDb = events.map((event) => plainToClass(Event, event));
    this.eventRepository.save(eventsDb);
  }
}
