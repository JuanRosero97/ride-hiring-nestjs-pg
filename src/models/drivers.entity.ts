import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Travels } from './travels.entity';

@Entity('drivers', { schema: 'public' })
export class Drivers extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_user' })
  idUser: number;

  @Column('int', {
    name: 'available',
    default: () => "'1'",
    comment: '1 = available, 0 = not available',
  })
  available: number;

  @ManyToOne(() => User, (user) => user.drivers)
  @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
  idUserDriver: User;

  @OneToMany(() => Travels, (travel) => travel.idDriverRel)
  idTravelDriver: Travels[];
}
