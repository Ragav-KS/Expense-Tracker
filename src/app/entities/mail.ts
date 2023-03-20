import { EntitySchema } from 'typeorm';
import { ITransaction } from './transaction';

export interface IMail {
  id: string;
  transaction?: ITransaction | null;
  date_meta?: Date;
  meta_body?: string;
}

export const MailEntity = new EntitySchema<IMail>({
  name: 'Mails',
  columns: {
    id: {
      type: String,
      primary: true,
    },
  },
  relations: {
    transaction: {
      target: 'Transactions',
      nullable: true,
      type: 'one-to-one',
      cascade: ['insert', 'update'],
      joinColumn: true,
      eager: true,
    },
  },
});
