import { IResponse } from 'src/common/schemas/response.schema';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { buildResponse } from 'src/common/builders/response.builder';
import { OrderDetailOutput } from '../contracts/output/order-detail.output';

export class GetOrderDetailUseCase {
  constructor(private readonly repo: OrdersRepositoryPort) {}

  async execute(id: string): Promise<IResponse<OrderDetailOutput>> {
    const detail = await this.repo.findDetailProjection(id);
    if (!detail) {
      throw new Error('ORDER_NOT_FOUND');
    }

    return buildResponse('KDS_ORD_R0002', detail);
  }
}
