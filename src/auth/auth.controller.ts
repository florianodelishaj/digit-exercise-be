import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './interface/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): any {
    if (!user.email || !user.password) {
      throw new HttpException(
        'Email e password sono obbligatorie',
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = this.authService.registerUser(user);
    if (result) {
      return {
        email: user.email,
        msg: 'Utente registrato con successo',
      };
    } else {
      return { msg: "Errore durante la registrazione dell'utente" };
    }
  }

  @Post('login')
  login(@Body() params: User): any {
    const token = this.authService.login(params.email, params.password);
    if (token) {
      return {
        token,
        email: params.email,
      };
    } else {
      return { msg: 'Credenziali non valide' };
    }
  }
}
