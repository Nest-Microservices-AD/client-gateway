import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';
import { PRODUCT_SERVICE } from 'src/config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: { port: envs.PRODUCTS_MS_PORT, host: envs.PRODUCTS_MS_URL },
      },
    ]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
