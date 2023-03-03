import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from 'src/common/interfaces/payload.interface';
import { User } from 'src/models/users.entity';
import { UsersService } from '../../components/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.validateUser(email);

    if (user) {
      const isValidPass = await this.userService.comparePassword(
        user.passwordHash,
        pass,
      );

      if (isValidPass) return user;
      return null;
    }

    return null;
  }

  async signIn(user: User) {
    const payload: PayloadInterface = {
      username: user.username,
      email: user.email,
      id: user.id,
      rol: user.rol.name,
    };
    return {
      message: 'Login success',
      data: { token: this.jwtService.sign(payload) },
    };
  }
}
