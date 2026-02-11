import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { buildResponse } from 'src/common/builders/response.builder';
import { IResponse } from 'src/common/schemas';
import { ListOrdersInput } from '../contracts/input/list-orders.input';
import { ListOrdersOutput } from '../contracts/output/order-list.output';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

export class ListOrdersUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(
    filter?: ListOrdersInput,
  ): Promise<IResponse<ListOrdersOutput>> {
    const statuses = filter?.status?.map((s) => OrderStatus.from(s));

    const result = await this.repo.findList({
      ...filter,
      status: statuses,
    });
    return buildResponse('KDS_ORD_R0003', result);
  }
}
