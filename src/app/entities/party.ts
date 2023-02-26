import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'Party',
})
export class Party {
  @PrimaryColumn()
  id!: string;

  @Column({
    nullable: true,
  })
  givenName!: string;
}
