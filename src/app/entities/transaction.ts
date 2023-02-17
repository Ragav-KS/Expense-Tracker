import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'float',
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
