import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/users.entity';
import * as security from '../../common/util/security';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string) {
    let user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.rol', 'rol')
      .where(`user.email = ('${email}') and user.status = 1`)
      .getOne();

    return user;
  }

  async comparePassword(user_password: string, password: string) {
    return await security.comparePassword(user_password, password);
  }
}
