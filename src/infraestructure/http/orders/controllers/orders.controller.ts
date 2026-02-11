import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/common/pipes';
import {
  GetOrdersDto,
  type IGetOrdersDto,
  IngestOrderDto,
  type IIngestOrderDto,
  UpdateOrderStatusDto,
  type IUpdateOrderStatusDto,
  UpdateOrderWebhookDto,
  type IUpdateOrderWebhookDto,
} from '../dtos';
import { buildEndpoint } from 'src/common/builders';

import { ValidateCredentialsGuard } from 'src/common/guards';
import {
  ApiListOrders,
  ApiIngestOrder,
  ApiUpdateOrderStatus,
  ApiGetOrderDetail,
} from 'src/common/decorators/swagger/orders';
import { GetOrderDetailUseCase } from 'src/application/orders/use-cases/order-details.usecase';
import {
  IngestOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase,
} from 'src/application/orders';
import { UpdateOrderStatusByExternalIdUseCase } from 'src/application/orders/use-cases/update-order-status-by-external-id.usecase';

@Controller()
export class OrdersController {
  constructor(
    private readonly ingestOrder: IngestOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly updateStatus: UpdateOrderStatusUseCase,
    private readonly getOrderDetail: GetOrderDetailUseCase,
    private readonly updateOrderStatusWebhook: UpdateOrderStatusByExternalIdUseCase,
  ) {}

  @ApiListOrders()
  @Get(buildEndpoint('GET_ORDER_LIST_V1').fullPath)
  getOrders(@Query(new ZodValidationPipe(GetOrdersDto)) query: IGetOrdersDto) {
    return this.listOrders.execute(query);
  }

  @UseGuards(ValidateCredentialsGuard)
  @ApiIngestOrder()
  @Post(buildEndpoint('INGEST_ORDER_V1').fullPath)
  @HttpCode(204)
  async ingest(
    @Body(new ZodValidationPipe(IngestOrderDto)) body: IIngestOrderDto,
  ) {
    await this.ingestOrder.execute(body);
  }

  @ApiUpdateOrderStatus()
  @Patch(buildEndpoint('UPDATE_ORDER_STATUS_V1').fullPath)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOrderStatusDto))
    body: IUpdateOrderStatusDto,
  ) {
    return this.updateStatus.execute({
      id,
      toStatus: body.toStatus,
    });
  }

  @ApiGetOrderDetail()
  @Get(buildEndpoint('GET_ORDER_DETAIL_V1').fullPath)
  getDetail(@Param('id') id: string) {
    return this.getOrderDetail.execute(id);
  }

  @UseGuards(ValidateCredentialsGuard)
  @Post(buildEndpoint('UPDATE_ORDER_WEBHOOK_V1').fullPath)
  @HttpCode(204)
  async updateOrderFromWebhook(
    @Body(new ZodValidationPipe(UpdateOrderWebhookDto))
    body: IUpdateOrderWebhookDto,
  ) {
    await this.updateOrderStatusWebhook.execute(body);
  }
}
