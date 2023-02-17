import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'float',
  })
  amount!: number;
}
