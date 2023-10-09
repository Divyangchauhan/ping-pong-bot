import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as pingPongAbi from '../contract-abi/ping-pong.abi.json';
import { EventDbService } from '../event-db/event.db.service';
import { EventProcessorService } from 'src/event-processor/event.processor.service';
import { getEthersProvider } from 'src/utils/ethers.provider';

@Injectable()
export class EventReaderService {
  constructor(
    @Inject(EventDbService)
    private readonly eventDbService: EventDbService,
    @Inject(EventProcessorService)
    private readonly eventProcessorService: EventProcessorService,
  ) {}

  async readPastEvents() {
    // Read events from blockchain
    const provider = getEthersProvider();
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      provider,
    );
    console.log('Reading Past events');
    const etherEvents = await contract.queryFilter(
      process.env.EventToRead!,
      Number(process.env.fromBlock),
    );

    console.log(`Got ${etherEvents.length} events`);
    // Save events to database
    await this.eventDbService.saveEvents(etherEvents);

    // Call Pong function
    await this.eventProcessorService.processEvents(etherEvents);
  }

  async readEvents() {
    // Read events from blockchain
    const provider = getEthersProvider();
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      provider,
    );

    console.log('Reading live events');
    contract.on(process.env.EventToRead!, async (etherEvent: ethers.Event) => {
      console.log(`Received event ${etherEvent.transactionHash}`);
      // Save events to database
      await this.eventDbService.saveOneEvent(etherEvent);

      // Call Pong function
      this.eventProcessorService.processOneEvent(etherEvent);
    });
  }
}
