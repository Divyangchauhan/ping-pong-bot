import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as pingPongAbi from '../contract-abi/ping-pong.abi.json';
import { EventDbService } from '../event-db/event.db.service';
import { NonceManager } from '@ethersproject/experimental';

@Injectable()
export class EventProcessorService {
  constructor(
    @Inject(EventDbService)
    private readonly eventDbService: EventDbService,
  ) {}

  async processEvents(events: ethers.Event[]) {
    // get provider and cotract instance
    const provider = this.getEthersProvider();
    const signer = new ethers.Wallet(process.env.PrivateKey!, provider);
    const managedSigner = new NonceManager(signer);
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      managedSigner,
    );

    // Call Pong function
    events.forEach(async (event) => {
      const eventDb = await this.eventDbService.findOneEvent(
        event.transactionHash,
      );
      if (eventDb?.processed) {
        console.log('Event already processed');
      } else {
        await contract.pong(event.transactionHash);
        await this.eventDbService.markEventProcessed(event);
      }
    });
  }

  async processOneEvent(event: ethers.Event) {
    // get provider and cotract instance
    const provider = this.getEthersProvider();
    const signer = new ethers.Wallet(process.env.PrivateKey!, provider);
    const managedSigner = new NonceManager(signer);
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      managedSigner,
    );

    // Call Pong function
    const eventDb = await this.eventDbService.findOneEvent(
      event.transactionHash,
    );
    if (eventDb?.processed) {
      console.log('Event already processed');
    } else {
      await contract.pong(event.transactionHash);
      await this.eventDbService.markEventProcessed(event);
    }
  }

  getEthersProvider(): ethers.providers.FallbackProvider {
    const infuraProvider = new ethers.providers.InfuraProvider(
      process.env.Network,
      process.env.InfuraAPIKey,
    );

    return new ethers.providers.FallbackProvider([infuraProvider]);
  }
}
