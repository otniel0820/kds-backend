import { UpdateOrderStatusUseCase } from '../use-cases/update-order-status.usecase';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';
import { buildResponse } from 'src/common/builders/response.builder';

jest.mock('src/common/builders/response.builder', () => ({
  buildResponse: jest.fn(),
}));

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let repo: jest.Mocked<OrdersRepositoryPort>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepositoryPort>;

    useCase = new UpdateOrderStatusUseCase(repo);
  });

  it('should update order status successfully', async () => {
    const mockOrder = {
      id: 'order-1',
      transitionTo: jest.fn(),
    };

    repo.findById.mockResolvedValue(mockOrder as any);
    repo.update.mockResolvedValue(undefined);

    (buildResponse as jest.Mock).mockReturnValue({
      success: true,
      data: null,
    });

    const input = {
      id: 'order-1',
      toStatus: 'CONFIRMED' as any,
    };

    const result = await useCase.execute(input);

    expect(repo.findById).toHaveBeenCalledWith('order-1');

    expect(mockOrder.transitionTo).toHaveBeenCalledWith(
      OrderStatus.from('CONFIRMED'),
    );

    expect(repo.update).toHaveBeenCalledWith(mockOrder);

    expect(buildResponse).toHaveBeenCalledWith('KDS_ORD_R0004');

    expect(result).toEqual({
      success: true,
      data: null,
    });
  });

  it('should throw ORDER_NOT_FOUND when order does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'invalid-id', toStatus: 'CONFIRMED' as any }),
    ).rejects.toThrow('ORDER_NOT_FOUND');

    expect(repo.findById).toHaveBeenCalledWith('invalid-id');
  });
});
