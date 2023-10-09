import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as pingPongAbi from '../contract-abi/ping-pong.abi.json';
import { EventDbService } from '../event-db/event.db.service';
import { NonceManager } from '@ethersproject/experimental';
import { TransactionDbService } from 'src/event-db/transaction.db.service';
import { getEthersProvider } from 'src/utils/ethers.provider';

@Injectable()
export class EventProcessorService {
  constructor(
    @Inject(EventDbService)
    private readonly eventDbService: EventDbService,
    @Inject(TransactionDbService)
    private readonly transactionDbService: TransactionDbService,
  ) {}

  async processEvents(events: ethers.Event[]) {
    // get provider and cotract instance
    const provider = getEthersProvider();
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
      console.log(eventDb);
      // Check if event is already processed and pong function is called
      if (eventDb?.processed) {
        console.log('Event already processed');
        console.log('Checking if transaction is saved in db');

        const transactionDb =
          await this.transactionDbService.findOneTransaction(eventDb);

        if (!transactionDb) {
          // Check if pong event with event.transactionhash is emmited
          const txEvent = (
            await contract.queryFilter('Pong', event.blockNumber)
          ).filter((event) => event.args?.txHash === eventDb?.transactionHash);

          if (txEvent) {
            console.log('Transaction was mined');
            console.log('Marking event as mined');
            await this.eventDbService.markEventMined(event.transactionHash);
          } else {
            // if txEvent is empty then it is not mined yet
            // it might be in mempool but since no api to check mempool
          }
        } else {
          // If transaction is in db then check if it is mined
          console.log('Checking if transaction was included on chain');
          const isMined = await provider.getTransactionReceipt(
            event.transactionHash,
          );
          if (isMined) {
            console.log('Transaction was mined');
            console.log('Marking event as mined');
            await this.eventDbService.markEventMined(event.transactionHash);
          } else {
            console.log('Transaction was not mined');
            console.log('Wait for it to be included on chain');
            // if transction is sent, cron job will tke care of it
          }
        }
      } else {
        const tx = await contract.pong(event.transactionHash);
        tx.event = eventDb;
        await this.transactionDbService.saveOneTransaction(tx, eventDb!);
        await this.eventDbService.markEventProcessed(event);
      }
    });
  }

  async processOneEvent(event: ethers.Event) {
    // get provider and cotract instance
    const provider = getEthersProvider();
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
      console.log('Checking if transaction is saved in db');

      const transactionDb =
        await this.transactionDbService.findOneTransaction(eventDb);

      if (!transactionDb) {
        // Check if pong event with event.transactionhash is emmited
        const txEvent = (
          await contract.queryFilter('Pong', event.blockNumber)
        ).filter((event) => event.args?.txHash === eventDb?.transactionHash);

        if (txEvent) {
          console.log('Transaction was mined');
          console.log('Marking event as mined');
          await this.eventDbService.markEventMined(event.transactionHash);
        } else {
          // if txEvent is empty then it is not mined yet
          // it might be in mempool but since no api to check mempool
        }
      } else {
        // If transaction is in db then check if it is mined
        console.log('Checking if transaction was included on chain');
        const isMined = await provider.getTransactionReceipt(
          event.transactionHash,
        );
        if (isMined) {
          console.log('Transaction was mined');
          console.log('Marking event as mined');
          await this.eventDbService.markEventMined(event.transactionHash);
        } else {
          console.log('Transaction was not mined');
          console.log('Wait for it to be included on chain');
          // if transction is sent, cron job will tke care of it
        }
      }
    } else {
      await contract.pong(event.transactionHash);
      await this.eventDbService.markEventProcessed(event);
    }
  }
}
