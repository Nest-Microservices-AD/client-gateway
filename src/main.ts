import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('client-gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new ExceptionFilter());
  await app.listen(envs.port ?? 3000);
  logger.verbose(`Client Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
