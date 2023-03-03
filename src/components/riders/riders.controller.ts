import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { newTravelDto } from '../../common/dto/travel.dto';
import { Role } from '../../common/enum/roles.enum';
import { PayloadInterface } from '../../common/interfaces/payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RidersService } from './riders.service';

@Controller('riders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RidersController {
  constructor(private ridersService: RidersService) {}

  @Post('/new-travel')
  @Roles(Role.RIDER)
  async createTravel(@Req() req, @Body() newTravel: newTravelDto) {
    const user: PayloadInterface = req.user;
    return await this.ridersService.createTravel(user, newTravel);
  }
}
