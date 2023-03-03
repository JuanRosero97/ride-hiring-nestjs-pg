import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Drivers } from './drivers.entity';
import { Riders } from './riders.entity';
import { Roles } from './roles.entity';

@Entity('users', { schema: 'public' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', length: 255 })
  username: string;

  @Column('varchar', {
    name: 'email',
    nullable: true,
    length: 128,
    unique: true,
  })
  email: string;

  @Column('varchar', { name: 'password_hash', length: 255, select: true })
  passwordHash: string;

  @Column('int', {
    name: 'status',
    default: () => "'1'",
    comment: '0: inactive, 1: active',
  })
  status: number;

  @Column('int', { name: 'id_rol', comment: '1: rider, 2: driver' })
  idRol: number;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: number;

  @ManyToOne(() => Roles, (roles) => roles.users)
  @JoinColumn([{ name: 'id_rol', referencedColumnName: 'id' }])
  rol: Roles;

  @OneToMany(() => Drivers, (driver) => driver.idUserDriver)
  drivers: Drivers[];

  @OneToMany(() => Riders, (rider) => rider.idUserRider)
  riders: Riders[];
}
