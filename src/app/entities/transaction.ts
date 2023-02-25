import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Party } from './party';

@Entity({
  name: 'Transactions',
})
export class Transaction {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  amount!: number;

  @Column({
    nullable: true,
  })
  transactionType!: string;

  @Column({
    nullable: true,
  })
  account!: string;

  @Column({
    nullable: true,
  })
  mode!: string;

  @ManyToOne(() => Party, (party) => party.id, {
    cascade: ['insert'],
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'party' })
  party!: Party;

  @Column({
    nullable: true,
  })
  date!: Date;
}
