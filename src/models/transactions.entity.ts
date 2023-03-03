import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Travels } from './travels.entity';

@Entity('transactions', { schema: 'public' })
export class Transactions extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'reference',
    length: 150,
    nullable: false,
    comment: 'reference of the transaction',
  })
  reference: string;

  @Column('varchar', {
    name: 'id_trx_wompi',
    length: 150,
    nullable: false,
    comment: 'id of the transaction in wompi',
  })
  idTrxWompi: string;

  @Column('int', { name: 'id_travel' })
  idTravel: number;

  @Column('text', {
    name: 'total',
    comment: 'total amount of the travel',
  })
  total: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'NOW()',
    comment: 'date of the transaction',
  })
  createdAt: Date;

  @Column('int', {
    name: 'status',
    comment:
      '0 Pending, 1 approved, 2 rejected, 3 cancelled, 4 internal error of the payment method, 5 undefined status',
  })
  status: number;

  @Column('text', {
    name: 'wompi_response',
    comment: 'will store future wompi response',
    nullable: true,
  })
  wompiResponse: string;

  @Column('timestamp', {
    name: 'approval_at',
    nullable: true,
    comment: 'date of the wompi approval',
  })
  approvalAt: Date;

  @ManyToOne(() => Travels, (travel) => travel.transactions)
  @JoinColumn([{ name: 'id_travel', referencedColumnName: 'id' }])
  idTravelRel: Travels;
}
