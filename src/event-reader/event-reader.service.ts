import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as pingPongAbi from '../contract-abi/ping-pong.abi.json';
import { EventSaverService } from './event-saver.service';

@Injectable()
export class EventReaderService {
  constructor(
    @Inject(EventSaverService)
    private readonly eventSaverService: EventSaverService,
  ) {}

  async readPastEvents() {
    // Read events from blockchain
    const provider = this.getEthersProvider();
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      provider,
    );
    const events = await contract.queryFilter(
      'Pong',
      Number(process.env.fromBlock),
    );

    // Save events to database
    this.eventSaverService.saveEvents(events);

    // Call Pong function
  }

  getEthersProvider(): ethers.providers.FallbackProvider {
    const infuraProvider = new ethers.providers.InfuraProvider(
      'goerli',
      process.env.InfuraKey,
    );

    return new ethers.providers.FallbackProvider([infuraProvider]);
  }
}
