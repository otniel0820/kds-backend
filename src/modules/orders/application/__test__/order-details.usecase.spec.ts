import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { buildResponse } from 'src/common/builders/response.builder';
import { GetOrderDetailUseCase } from '../use-cases/get-order-detail.usecase';

jest.mock('src/common/builders/response.builder', () => ({
  buildResponse: jest.fn(),
}));

describe('GetOrderDetailUseCase', () => {
  let useCase: GetOrderDetailUseCase;
  let repo: jest.Mocked<OrdersRepositoryPort>;

  beforeEach(() => {
    repo = {
      findDetailProjection: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepositoryPort>;

    useCase = new GetOrderDetailUseCase(repo);
  });

  it('should return order detail when found', async () => {
    const mockDetail = {
      id: 'order-1',
      displayNumber: '001',
    } as any;

    repo.findDetailProjection.mockResolvedValue(mockDetail);

    (buildResponse as jest.Mock).mockReturnValue({
      success: true,
      data: mockDetail,
    });

    const result = await useCase.execute('order-1');

    expect(repo.findDetailProjection).toHaveBeenCalledWith('order-1');

    expect(buildResponse).toHaveBeenCalledWith('KDS_ORD_R0002', mockDetail);

    expect(result).toEqual({
      success: true,
      data: mockDetail,
    });
  });

  it('should throw ORDER_NOT_FOUND when detail does not exist', async () => {
    repo.findDetailProjection.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(
      'ORDER_NOT_FOUND',
    );

    expect(repo.findDetailProjection).toHaveBeenCalledWith('invalid-id');
  });
});
