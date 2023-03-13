import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Transaction } from './transaction';

@Entity({
  name: 'Mails',
})
export class Mail {
  @PrimaryColumn()
  id!: string;

  @OneToOne(() => Transaction, (transaction) => transaction.id, {
    cascade: ['insert', 'update'],
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'transaction' })
  transaction!: Transaction;

  meta_body!: any;
}
