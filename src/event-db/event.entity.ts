import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

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
}
