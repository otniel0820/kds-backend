/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import {
  IngestOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from 'src/application/orders';
import { ZodValidationPipe } from 'src/common/pipes';
import {
  GetOrdersDto,
  type IGetOrdersDto,
  IngestOrderDto,
  type IIngestOrderDto,
  UpdateOrderStatusDto,
  type IUpdateOrderStatusDto,
} from '../dtos';
import { buildEndpoint } from 'src/common/builders';

@Controller()
export class OrdersController {
  constructor(
    private readonly ingestOrder: IngestOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateStatus: UpdateOrderStatusUseCase,
  ) {}

  @Get(buildEndpoint('GET_ORDER_LIST_V1').fullPath)
  getOrders(@Query(new ZodValidationPipe(GetOrdersDto)) query: IGetOrdersDto) {
    return this.listOrders.execute(query);
  }

  @Post(buildEndpoint('INGEST_ORDER_V1').fullPath)
  ingest(@Body(new ZodValidationPipe(IngestOrderDto)) body: IIngestOrderDto) {
    return this.ingestOrder.execute(body);
  }

  @Patch(buildEndpoint('UPDATE_ORDER_STATUS_V1').fullPath)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderStatusDto))
    body: IUpdateOrderStatusDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return this.updateStatus.execute({
      id,
      toStatus: body.toStatus,
    });
  }
}
