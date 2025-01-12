import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guards';
import { Token, User } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.natsClient.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  async verifyToken(@User() user: any, @Token() token: string) {
    return { user, token };
    // return this.natsClient.send('auth.verify.user', { req }).pipe(
    //   catchError((error) => {
    //     throw new RpcException(error);
    //   }),
    // );
  }
}
