import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event: Event) => event.transactions, {
    eager: true,
    nullable: false,
  })
  event: Event;

  @Column({ type: 'integer', nullable: true })
  blockNumber: number | null;

  @Column({ type: 'varchar', nullable: true })
  blockHash: string | null;

  @Column()
  chainId: number;

  @Column({ type: 'integer', nullable: true })
  transactionIndex: number | null;

  @Column({ type: 'varchar', nullable: true })
  removed: string | null;

  @Column()
  data: string;

  @Column()
  from: string;

  @Column()
  gasLimit: string;

  @Column()
  gasPrice: string;

  @Column({ unique: true })
  hash: string;

  @Column()
  maxFeePerGas: string;

  @Column()
  maxPriorityFeePerGas: string;

  @Column()
  nonce: number;

  @Column()
  to: string;

  @Column()
  type: string;

  @Column()
  value: string;

  @Column({ default: false })
  mined: boolean;
}
