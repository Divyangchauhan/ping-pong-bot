import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.event)
  transactions?: Transaction[];

  @Column()
  blockNumber: number;

  @Column()
  blockHash: string;

  @Column()
  transactionIndex: number;

  @Column()
  removed: string;

  @Column()
  data: string;

  //   @Column()
  //   topics: string[];

  @Column({ unique: true })
  transactionHash: string;

  @Column()
  logIndex: number;

  @Column()
  event: string;

  @Column()
  eventSignature: string;

  //   @Column()
  //   args: string[];

  @Column({ default: false })
  processed: boolean;

  @Column({ default: false })
  mined: boolean;
}
