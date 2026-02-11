import { OrderEntity } from '../../domain';
import { OrderPriority } from '../../domain/value-objects/order-priority.vo';
import { IngestOrderInput } from '../contracts/input/ingest-orders.input';
import { OrderEventsPort } from '../ports/order-events.port';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { PartnersRepositoryPort } from '../ports/partners-repository.port';
import { ProductsRepositoryPort } from '../ports/products-repository.port';
import { IngestOrderUseCase } from '../use-cases/ingest-order.usecase';

describe('IngestOrderUseCase', () => {
  let useCase: IngestOrderUseCase;

  let ordersRepo: jest.Mocked<OrdersRepositoryPort>;
  let partnersRepo: jest.Mocked<PartnersRepositoryPort>;
  let productsRepo: jest.Mocked<ProductsRepositoryPort>;
  let events: jest.Mocked<OrderEventsPort>;

  let mockInput: IngestOrderInput;

  beforeEach(() => {
    ordersRepo = {
      findByFilter: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<OrdersRepositoryPort>;

    partnersRepo = {
      findBySlug: jest.fn(),
    } as unknown as jest.Mocked<PartnersRepositoryPort>;

    productsRepo = {
      findBySlugs: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepositoryPort>;

    events = {
      orderIngested: jest.fn(),
    } as unknown as jest.Mocked<OrderEventsPort>;

    useCase = new IngestOrderUseCase(
      ordersRepo,
      partnersRepo,
      productsRepo,
      events,
    );

    mockInput = {
      source: 'UBER',
      externalId: '123',
      customerName: 'John Doe',
      customerPhone: '123456789',
      deliveryAddress: 'Street 123',
      notes: 'No onions',
      priority: OrderPriority.from('HIGH'),
      items: [{ slug: 'pizza', qty: 2 }],
    };
  });

  it('should ingest order successfully', async () => {
    ordersRepo.findByFilter.mockResolvedValue([]);

    partnersRepo.findBySlug.mockResolvedValue({
      id: 'partner-1',
      name: 'Uber',
      image: 'img.png',
    });

    productsRepo.findBySlugs.mockResolvedValue([
      { id: 'product-1', slug: 'pizza' },
    ]);

    const createdOrder = {
      toPrimitives: () => ({
        id: 'order-1',
        displayNumber: '001',
        status: { toString: () => 'CREATED' },
        priority: { toString: () => 'HIGH' },
        timers: {
          placedAt: new Date(),
          confirmedAt: undefined,
          preparingAt: undefined,
          readyAt: undefined,
        },
      }),
    } as unknown as OrderEntity;
    ordersRepo.create.mockResolvedValue(createdOrder);

    await useCase.execute(mockInput);

    expect(ordersRepo.findByFilter).toHaveBeenCalledWith({
      source: 'UBER',
      externalId: '123',
    });

    expect(partnersRepo.findBySlug).toHaveBeenCalledWith('UBER');
    expect(productsRepo.findBySlugs).toHaveBeenCalledWith(['pizza']);
    expect(ordersRepo.create).toHaveBeenCalledTimes(1);
    expect(events.orderIngested).toHaveBeenCalledTimes(1);
  });

  it('should throw if order already exists', async () => {
    ordersRepo.findByFilter.mockResolvedValue([{} as OrderEntity]);

    await expect(useCase.execute(mockInput)).rejects.toThrow('KDS_ORDER_E0003');
  });

  it('should throw if partner is invalid and source is not INTERNAL', async () => {
    ordersRepo.findByFilter.mockResolvedValue([]);
    partnersRepo.findBySlug.mockResolvedValue(null);

    await expect(useCase.execute(mockInput)).rejects.toThrow('KDS_ORDER_E0004');
  });

  it('should allow null partner when source is INTERNAL', async () => {
    const internalInput: IngestOrderInput = {
      ...mockInput,
      source: 'INTERNAL',
    };

    ordersRepo.findByFilter.mockResolvedValue([]);
    partnersRepo.findBySlug.mockResolvedValue(null);
    productsRepo.findBySlugs.mockResolvedValue([
      { id: 'product-1', slug: 'pizza' },
    ]);

    const createdOrder = {
      toPrimitives: () => ({
        id: 'order-1',
        displayNumber: '001',
        status: { toString: () => 'RECEIVED' },
        priority: { toString: () => 'HIGH' },
        timers: {
          placedAt: new Date(),
          confirmedAt: undefined,
          preparingAt: undefined,
          readyAt: undefined,
        },
      }),
    } as unknown as OrderEntity;
    ordersRepo.create.mockResolvedValue(createdOrder);

    await useCase.execute(internalInput);
  });

  it('should throw if products are invalid', async () => {
    ordersRepo.findByFilter.mockResolvedValue([]);

    partnersRepo.findBySlug.mockResolvedValue({
      id: 'partner-1',
      name: 'Uber',
      image: 'img.png',
    });

    productsRepo.findBySlugs.mockResolvedValue([]);

    await expect(useCase.execute(mockInput)).rejects.toThrow('KDS_ORDER_E0005');
  });
});
