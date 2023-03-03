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
import { Drivers } from './drivers.entity';
import { Riders } from './riders.entity';
import { Transactions } from './transactions.entity';

@Entity('travels', { schema: 'public' })
export class Travels extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_driver', comment: 'assigned driver id' })
  idDriver: number;

  @Column('int', { name: 'id_rider', comment: 'creator passenger id' })
  idRider: number;

  @Column('timestamp', {
    name: 'start_at',
    comment: 'start time of the travel',
  })
  startAt: Date;

  @Column('timestamp', {
    name: 'end_at',
    nullable: true,
    comment: 'end time of the travel',
  })
  endAt: Date;

  @Column('text', {
    name: 'lat_start',
    nullable: false,
    comment: 'start latitude',
  })
  lat_start: string;

  @Column('text', {
    name: 'long_start',
    nullable: false,
    comment: 'start longitude',
  })
  long_start: string;

  @Column('text', {
    name: 'lat_end',
    nullable: true,
    comment: 'end latitude',
  })
  lat_end: string;

  @Column('text', {
    name: 'long_end',
    nullable: true,
    comment: 'end longitude',
  })
  long_end: string;

  @Column('text', {
    name: 'total',
    nullable: true,
    comment: 'total amount of the travel',
  })
  total: string;

  @Column('int', {
    name: 'status',
    default: () => "'1'",
    comment: '1: Created, 2: Finished',
  })
  status: number;

  @ManyToOne(() => Drivers, (driver) => driver.idTravelDriver)
  @JoinColumn([{ name: 'id_driver', referencedColumnName: 'id' }])
  idDriverRel: Drivers;

  @ManyToOne(() => Riders, (rider) => rider.idTravelRider)
  @JoinColumn([{ name: 'id_rider', referencedColumnName: 'id' }])
  idRiderRel: Riders;

  @OneToMany(() => Transactions, (transaction) => transaction.idTravelRel)
  transactions: Transactions[];
}
