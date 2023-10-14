import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Transaction } from './transaction.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransactionDbService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async saveOneTransaction(etherTransaction: ethers.Transaction, event: Event) {
    // write javascript code wait for 10 second
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const transaction = new Transaction();
    transaction.event = event;
    transaction.blockNumber = null;
    transaction.blockHash = null;
    transaction.chainId = etherTransaction.chainId;
    transaction.transactionIndex = null;
    transaction.removed = null;
    transaction.data = etherTransaction.data;
    transaction.from = etherTransaction.from!;
    transaction.gasLimit = String(etherTransaction.gasLimit);
    transaction.gasPrice = String(etherTransaction.gasPrice);
    transaction.hash = etherTransaction.hash!;
    transaction.maxFeePerGas = String(etherTransaction.maxFeePerGas);
    transaction.maxPriorityFeePerGas = String(
      etherTransaction.maxPriorityFeePerGas,
    );
    transaction.nonce = etherTransaction.nonce;
    transaction.to = etherTransaction.to!;
    transaction.type = String(etherTransaction.type);
    transaction.value = String(etherTransaction.value);
    transaction.mined = false;
    transaction.event = event;

    console.log('Saving transaction');
    const transactionDb = await this.transactionRepository.findOne({
      where: { hash: transaction.hash },
    });
    if (!transactionDb) {
      this.transactionRepository.save(transaction);
    }
  }

  async findOneTransaction(event: Event) {
    return this.transactionRepository.findOne({
      where: { event: { id: event.id }, from: process.env.Address! },
    });
  }

  async findUnminedTransaction() {
    return this.transactionRepository.find({
      where: { from: process.env.Address!, mined: false },
    });
  }

  async markTransactionMined(transaction: ethers.Transaction | Transaction) {
    console.log(`marking event ${transaction.hash} as mined`);
    let transactionDb = await this.transactionRepository.findOne({
      where: { hash: transaction.hash },
    });
    if (!transactionDb) {
      transactionDb = await this.transactionRepository.save(
        plainToClass(Transaction, transaction),
      );
      console.log('Transaction saved');
    }
    await this.transactionRepository.update(
      { id: transactionDb.id },
      { mined: true },
    );
  }
}
