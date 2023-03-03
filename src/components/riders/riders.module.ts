import { Module } from '@nestjs/common';
import { RidersService } from './riders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Riders } from '../../models/riders.entity';
import { RidersController } from './riders.controller';
import { Travels } from '../../models/travels.entity';
import { Drivers } from '../../models/drivers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Riders, Travels, Drivers])],
  controllers: [RidersController],
  providers: [RidersService],
})
export class RidersModule {}
