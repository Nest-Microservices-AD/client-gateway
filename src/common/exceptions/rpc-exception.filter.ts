import { Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const error = exception.getError();

    if (typeof error === 'object' && 'status' in error && 'message' in error) {
      return response
        .status(isNaN(+error.status) ? 400 : error.status)
        .json(error);
    } else {
      return response.status(400).json(error);
    }
  }
}
