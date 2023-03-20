import { EntitySchema } from 'typeorm';
import { ITransaction } from './transaction';

export interface IMail {
  id?: string;
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
      type: 'one-to-one',
      joinColumn: true,
      cascade: ['insert', 'update'],
      nullable: true,
      eager: true,
    },
  },
});
