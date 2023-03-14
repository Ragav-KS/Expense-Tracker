import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'Party',
})
export class Party {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  givenName!: string | null;
}
