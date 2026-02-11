import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { OrderEventsPort } from '../ports/order-events.port';
import {
  PartnerLookup,
  PartnersRepositoryPort,
} from '../ports/partners-repository.port';
import { ProductsRepositoryPort } from '../ports/products-repository.port';
import { IngestOrderInput } from '../contracts/input/ingest-orders.input';
import { OrderSummary } from '../contracts/output/order-symary.output';
import { OrderEntity } from '../../domain';
import { OrderPriority } from '../../domain/value-objects';
import { resolveActiveTimer } from 'src/common/helpers/resolve-active-timer.helper';

export class IngestOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepositoryPort,
    private readonly partnersRepo: PartnersRepositoryPort,
    private readonly productsRepo: ProductsRepositoryPort,
    private readonly events: OrderEventsPort,
  ) {}

  async execute(input: IngestOrderInput): Promise<void> {
    const slugs = input.items.map((i) => i.slug);

    const existing = await this.ordersRepo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    this.ensureOrderDoesNotExist(existing);

    const partner = await this.partnersRepo.findBySlug(input.source);
    const products = await this.productsRepo.findBySlugs(slugs);

    this.ensurePartnerIsValid(input.source, partner);
    this.ensureProductsAreValid(slugs, products);

    const order = this.buildOrderEntity(input, partner, products);

    const created = await this.ordersRepo.create(order);

    await this.events.orderIngested(this.toEventDto(created, partner));
  }

  private ensureOrderDoesNotExist(existing: OrderEntity[]) {
    if (existing.length > 0) {
      throw new Error('KDS_ORDER_E0003');
    }
  }

  private ensurePartnerIsValid(source: string, partner: PartnerLookup | null) {
    if (!partner && source !== 'INTERNAL') {
      throw new Error('KDS_ORDER_E0004');
    }
  }

  private ensureProductsAreValid(
    slugs: string[],
    products: { id: string; slug: string }[],
  ) {
    if (products.length !== slugs.length) {
      throw new Error('KDS_ORDER_E0005');
    }
  }

  private buildOrderEntity(
    input: IngestOrderInput,
    partner: PartnerLookup | null,
    products: { id: string; slug: string }[],
  ): OrderEntity {
    const { items: rawItems, priority, ...rest } = input;

    const productMap = new Map(products.map((p) => [p.slug, p.id]));

    const partnerId = partner?.id;

    const items = rawItems.map((i) => ({
      productId: productMap.get(i.slug)!,
      qty: i.qty,
    }));

    return OrderEntity.createFromIngest({
      ...rest,
      partner: partnerId,
      priority: priority ? OrderPriority.from(priority) : undefined,
      items,
    });
  }

  private toEventDto(
    order: OrderEntity,
    partner: PartnerLookup | null,
  ): OrderSummary {
    const p = order.toPrimitives();

    return {
      id: p.id!,
      partnerName: partner?.name,
      partnerImage: partner?.image,
      displayNumber: p.displayNumber,
      status: p.status.toString(),
      priority: p.priority.toString(),
      activeTimer: resolveActiveTimer(p),
    };
  }
}
