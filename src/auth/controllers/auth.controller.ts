import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SafeUser } from '../../users/domain/entities/user.entity';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const user = await this.authService.register(registerDto.email, registerDto.password);
    return {
      message: 'Usuario registrado correctamente.',
      user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: ExpressRequest & { user: SafeUser }, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
