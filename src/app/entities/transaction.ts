import { EntitySchema } from 'typeorm';
import { IParty } from './party';

export interface ITransaction {
  id?: string;
  amount?: number;
  transactionType?: string | null;
  account?: string | null;
  mode?: string | null;
  party?: IParty;
  date?: Date;
}

export const TransactionEntity = new EntitySchema<ITransaction>({
  name: 'Transactions',
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
    },
    amount: {
      type: 'float',
      nullable: false,
      default: 1,
    },
    transactionType: {
      type: String,
      nullable: true,
      default: 'credit',
    },
    account: {
      type: String,
      nullable: true,
    },
    mode: {
      type: String,
      nullable: true,
    },
    date: {
      type: Date,
      nullable: false,
      default: 'NOW()',
    },
  },
  relations: {
    party: {
      target: 'Party',
      type: 'many-to-one',
      joinColumn: true,
      cascade: ['insert', 'update'],
      eager: true,
    },
  },
});
