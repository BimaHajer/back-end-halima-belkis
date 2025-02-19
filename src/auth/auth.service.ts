/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/services/user/user.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { jwtConstants } from './constants';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (isPasswordMatching) {
        const { token, saltRounds, password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: AuthUserDto) {
    const userCurio: User = await this.validateUser(
      user.email,
      user.password,
    );
    if (userCurio) {
      const idUser = userCurio.id;
      const payload = {
        id: idUser,
        email: userCurio.email
      };
      const expiresIn =  user.rememberMe == true  ? 24*60*60 :	2*60*60

      return {
        idUser: idUser,
        access_token: this.jwtService.sign(payload, {
          secret: jwtConstants.secret,
          expiresIn: expiresIn,
        }),
        expiresIn: expiresIn,
        firstName: userCurio.firstName,
        lastName: userCurio.lastName,
      };
    } else {
      throw new NotFoundException(`Email et/ou mot de passe sont incorrects`);
    }
  }
}
