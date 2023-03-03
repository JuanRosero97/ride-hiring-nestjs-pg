import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Travels } from './travels.entity';
import { User } from './users.entity';

@Entity('riders', { schema: 'public' })
export class Riders extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_user' })
  idUser: number;

  @Column('int', {
    name: 'id_payment_source',
    nullable: true,
    comment: 'id of the previously tokenized payment method',
  })
  id_payment_source: number;

  @ManyToOne(() => User, (user) => user.riders)
  @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
  idUserRider: User;

  @OneToMany(() => Travels, (travel) => travel.idRiderRel)
  idTravelRider: Travels[];
}
