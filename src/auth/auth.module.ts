import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
