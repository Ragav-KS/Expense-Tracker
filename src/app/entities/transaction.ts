import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Party } from './party';

@Entity({
  name: 'Transactions',
})
export class Transaction {
  @PrimaryColumn()
  @Generated('uuid')
  id!: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  amount: number = 0;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  transactionType: string | null = null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  account: string | null = null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  mode: string | null = null;

  @ManyToOne(() => Party, (party) => party.id, {
    cascade: ['insert', 'update'],
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'party' })
  party: Party = new Party();

  @Column({
    nullable: false,
  })
  date: Date = new Date();
}
