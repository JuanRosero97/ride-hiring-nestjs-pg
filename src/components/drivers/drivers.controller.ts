import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { closeTravelDto } from '../../common/dto/travel.dto';
import { Role } from '../../common/enum/roles.enum';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DriversService } from './drivers.service';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Put('/finished-travel/:id')
  @Roles(Role.DRIVER)
  async finishedTravel(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() closeTravel: closeTravelDto,
  ) {
    const user: PayloadInterface = req.user;
    return await this.driversService.finishedTravel(user, id, closeTravel);
  }
}
