import { ListOrdersUseCase } from '../use-cases/list-orders.usecase';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';
import { buildResponse } from 'src/common/builders/response.builder';

jest.mock('src/common/builders/response.builder', () => ({
  buildResponse: jest.fn(),
}));

describe('ListOrdersUseCase', () => {
  let useCase: ListOrdersUseCase;
  let repo: jest.Mocked<OrdersRepositoryPort>;

  beforeEach(() => {
    repo = {
      findList: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepositoryPort>;

    useCase = new ListOrdersUseCase(repo);
  });

  it('should return list without filter', async () => {
    const repoResult = [{ id: '1' }] as any;

    repo.findList.mockResolvedValue(repoResult);

    (buildResponse as jest.Mock).mockReturnValue({
      success: true,
      data: repoResult,
    });

    const result = await useCase.execute();

    expect(repo.findList).toHaveBeenCalledWith({
      status: undefined,
    });

    expect(buildResponse).toHaveBeenCalledWith('KDS_ORD_R0003', repoResult);

    expect(result).toEqual({
      success: true,
      data: repoResult,
    });
  });

  it('should transform status and call repo with OrderStatus instances', async () => {
    const repoResult = [{ id: '2' }] as any;

    repo.findList.mockResolvedValue(repoResult);

    (buildResponse as jest.Mock).mockReturnValue({
      success: true,
      data: repoResult,
    });

    const filter = {
      status: ['RECEIVED'],
    };

    await useCase.execute(filter);

    expect(repo.findList).toHaveBeenCalledWith({
      status: [OrderStatus.from('RECEIVED')],
    });

    expect(buildResponse).toHaveBeenCalledWith('KDS_ORD_R0003', repoResult);
  });
});
