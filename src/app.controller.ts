/* eslint-disable */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthUserDto } from './auth/dto/auth-user.dto';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() req: AuthUserDto) {
    return this.authService.login(req);
  }

}
