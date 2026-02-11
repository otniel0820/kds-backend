import { UpdateOrderStatusByExternalIdUseCase } from '../use-cases/update-order-status-by-external-id.usecase';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderEventsPort } from '../ports/order-events.port';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

describe('UpdateOrderStatusByExternalIdUseCase', () => {
  let useCase: UpdateOrderStatusByExternalIdUseCase;

  let ordersRepo: jest.Mocked<OrdersRepositoryPort>;
  let events: jest.Mocked<OrderEventsPort>;

  beforeEach(() => {
    ordersRepo = {
      findByFilter: jest.fn(),
      update: jest.fn(),
      findItemUpdateById: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepositoryPort>;

    events = {
      orderStatusUpdated: jest.fn(),
    } as unknown as jest.Mocked<OrderEventsPort>;

    useCase = new UpdateOrderStatusByExternalIdUseCase(ordersRepo, events);
  });

  it('should update order status and emit event', async () => {
    const mockOrder = {
      id: 'order-1',
      transitionTo: jest.fn(),
    };

    const mockProjection = {
      id: 'order-1',
      status: 'CONFIRMED',
    };

    ordersRepo.findByFilter.mockResolvedValue([mockOrder as any]);
    ordersRepo.update.mockResolvedValue(undefined);
    ordersRepo.findItemUpdateById.mockResolvedValue(mockProjection);

    const input = {
      source: 'UBER',
      externalId: '123',
      toStatus: 'CONFIRMED',
    };

    await useCase.execute(input);

    expect(ordersRepo.findByFilter).toHaveBeenCalledWith({
      source: 'UBER',
      externalId: '123',
    });

    expect(mockOrder.transitionTo).toHaveBeenCalledWith(
      OrderStatus.from('CONFIRMED'),
    );

    expect(ordersRepo.update).toHaveBeenCalledWith(mockOrder);

    expect(ordersRepo.findItemUpdateById).toHaveBeenCalledWith('order-1');

    expect(events.orderStatusUpdated).toHaveBeenCalledWith(mockProjection);
  });
});
