import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travels } from '../../models/travels.entity';
import { Drivers } from '../../models/drivers.entity';
import { Riders } from '../../models/riders.entity';
import { Transactions } from '../../models/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travels, Drivers, Riders, Transactions])],
  providers: [DriversService],
  controllers: [DriversController],
})
export class DriversModule {}
