import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, first, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  private extractToken(request: any): string {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return null;
    }
    const parts = authorization.split(' ');
    if (parts.length !== 2) {
      return null;
    }
    const [scheme, token] = parts;
    if (/^Bearer$/i.test(scheme)) {
      return token;
    }
    return null;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload = await firstValueFrom(
        this.client.send('auth.verify.user', token).pipe(
          catchError((error) => {
            throw new UnauthorizedException(error);
          }),
        ),
      );
      request['user'] = payload.user;
      request['token'] = payload.token;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
