import { OrderStatus } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderListDto } from '../dtos';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';

export class ListOrdersUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(filter?: {
    id?: string;
    source?: string;
    externalId?: string;
    status?: OrderStatus[];
    limit?: number;
    skip?: number;
  }): Promise<IResponse<{ orders: OrderListDto[]; total: number }>> {
    const result = await this.repo.findList({
      id: filter?.id,
      source: filter?.source,
      externalId: filter?.externalId,
      status: filter?.status,
      limit: filter?.limit,
      skip: filter?.skip,
    });

    return buildResponse('KDS_ORD_R0003', result);
  }
}
