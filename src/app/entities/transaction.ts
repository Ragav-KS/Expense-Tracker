import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({
    nullable: true,
  })
  party!: string;

  @Column({
    nullable: true,
  })
  date!: Date;
}
