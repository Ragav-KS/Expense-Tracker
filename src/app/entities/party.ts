import { EntitySchema } from 'typeorm';

export interface IParty {
  id: string;
  givenName?: string | null;
}

export const PartyEntity = new EntitySchema<IParty>({
  name: 'Party',
  columns: {
    id: {
      type: String,
      primary: true,
    },
    givenName: {
      type: String,
      nullable: true,
    },
  },
});
