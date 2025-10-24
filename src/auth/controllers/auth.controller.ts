import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SafeUser } from '../../users/domain/entities/user.entity';
import { LoginResponseDto, RegisterResponseDto } from '../dto/auth-responses.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra un nuevo usuario.' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'Usuario registrado correctamente.', type: RegisterResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos o contraseñas que no coinciden.' })
  @ApiConflictResponse({ description: 'El correo ya se encuentra registrado.' })
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
  @ApiOperation({ summary: 'Inicia sesión y obtiene un token JWT.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Inicio de sesión exitoso.', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  async login(@Request() req: ExpressRequest & { user: SafeUser }, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
