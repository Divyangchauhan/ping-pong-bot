import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class EventDbService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async saveEvents(etherEvents: ethers.Event[]) {
    const events = plainToInstance(Event, etherEvents);
    console.log('Saving events');
    events.forEach(async (event) => {
      const eventDb = await this.eventRepository.findOne({
        where: { transactionHash: event.transactionHash },
      });
      if (!eventDb) {
        this.eventRepository.save(event);
      }
    });
  }

  async saveOneEvent(etherEvent: ethers.Event) {
    const event = plainToInstance(Event, etherEvent);
    console.log('Saving event');
    const eventDb = await this.eventRepository.findOne({
      where: { transactionHash: event.transactionHash },
    });
    if (!eventDb) {
      this.eventRepository.save(event);
    }
  }

  async findOneEvent(transactionHash: ethers.Event['transactionHash']) {
    return this.eventRepository.findOne({
      where: { transactionHash: transactionHash },
    });
  }

  async markEventProcessed(event: ethers.Event) {
    console.log(`marking event ${event.transactionHash} as processed`);
    let eventDb = await this.eventRepository.findOne({
      where: { transactionHash: event.transactionHash },
    });
    if (!eventDb) {
      eventDb = await this.eventRepository.save(plainToClass(Event, event));
      console.log('Event saved');
    }
    await this.eventRepository.update({ id: eventDb.id }, { processed: true });
  }

  async markEventMined(transactionHash: ethers.Event['transactionHash']) {
    console.log(`marking event ${transactionHash} as mined`);
    let eventDb = await this.eventRepository.findOne({
      where: { transactionHash: transactionHash },
    });
    if (!eventDb) {
      eventDb = await this.eventRepository.save(plainToClass(Event, event));
      console.log('Event saved');
    }
    await this.eventRepository.update(
      { id: eventDb.id },
      { processed: true, mined: true },
    );
  }
}
