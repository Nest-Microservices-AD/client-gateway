import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrdersPaginationDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto).pipe(
      catchError((error) => {
        console.log(error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() paginationDto: OrdersPaginationDto) {
    return this.natsClient.send('findAllOrders', paginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send('findOneOrder', { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
  @Patch('status/:id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.natsClient.send('changeOrderStatus', { id, status }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
