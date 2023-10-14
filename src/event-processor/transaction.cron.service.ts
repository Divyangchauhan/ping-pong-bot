import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import * as pingPongAbi from '../contract-abi/ping-pong.abi.json';
import { EventDbService } from '../event-db/event.db.service';
import { NonceManager } from '@ethersproject/experimental';
import { TransactionDbService } from 'src/event-db/transaction.db.service';
import { getEthersProvider } from 'src/utils/ethers.provider';

@Injectable()
export class TransactionCronService {
  constructor(
    @Inject(EventDbService)
    private readonly eventDbService: EventDbService,
    @Inject(TransactionDbService)
    private readonly transactionDbService: TransactionDbService,
  ) {}
  private readonly logger = new Logger(TransactionCronService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleUnminedTransaction() {
    this.logger.debug('Called every hour to check for unmined transaction');

    // get provider and cotract instance
    const provider = getEthersProvider();
    const signer = new ethers.Wallet(process.env.PrivateKey!, provider);
    const managedSigner = new NonceManager(signer);
    const contract = new ethers.Contract(
      process.env.ContractAddress!,
      pingPongAbi,
      managedSigner,
    );

    // get unmined transaction
    const transactions =
      await this.transactionDbService.findUnminedTransaction();

    for (const transaction of transactions) {
      const tx = provider.getTransactionReceipt(transaction.hash);
      if (!tx) {
        // Resend transaction with higher gas price and same nonce
        const gasLimit = (
          await signer.estimateGas({
            to: process.env.ContractAddress!,
            value: transaction.data,
          })
        ).add(1000); // convert number to BigNumber

        signer.sendTransaction({
          to: process.env.ContractAddress!,
          data: transaction.data,
          value: transaction.value,
          gasLimit: gasLimit,
          nonce: transaction.nonce,
        });
        contract.pong(transaction.hash);
      } else {
        // Update mined transaction
        transaction.mined = true;
        await this.transactionDbService.markTransactionMined(transaction);
        await this.eventDbService.markEventMined(
          transaction.event.transactionHash,
        );
      }
    }
  }
}
