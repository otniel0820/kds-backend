import { OrderEntity } from 'src/domain/orders';
import { OrdersRepositoryPort } from '../ports/order-repository.port';
import { IIngestOrderDto } from 'src/infraestructure/http/orders/dtos';
import { OrderListDto } from '../dtos';
import { OrderEventsPort } from '../ports/order-events.port';
import { resolveActiveTimer } from 'src/common/helpers';
import {
  PartnerLookup,
  PartnersRepositoryPort,
} from '../ports/partners-repository.port';
import { ProductsRepositoryPort } from '../ports/products-repository.port';

export class IngestOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepositoryPort,
    private readonly partnersRepo: PartnersRepositoryPort,
    private readonly productsRepo: ProductsRepositoryPort,
    private readonly events: OrderEventsPort,
  ) {}

  async execute(input: IIngestOrderDto): Promise<void> {
    const slugs = input.items.map((i) => i.slug);

    const existing = await this.ordersRepo.findByFilter({
      source: input.source,
      externalId: input.externalId,
    });

    if (existing.length > 0) {
      return;
    }
    const partner = await this.partnersRepo.findBySlug(input.source);

    const products = await this.productsRepo.findBySlugs(slugs);

    this.ensureOrderDoesNotExist(existing);
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
    input: IIngestOrderDto,
    partner: PartnerLookup | null,
    products: { id: string; slug: string }[],
  ): OrderEntity {
    const { items: rawItems, ...rest } = input;

    const productMap = new Map(products.map((p) => [p.slug, p.id]));

    const partnerId = partner?.id;

    const items = rawItems.map((i) => ({
      productId: productMap.get(i.slug)!,
      qty: i.qty,
    }));

    return OrderEntity.createFromIngest({
      ...rest,
      partner: partnerId,
      items,
    });
  }

  private toEventDto(
    order: OrderEntity,
    partner: PartnerLookup | null,
  ): OrderListDto {
    const p = order.toPrimitives();

    return {
      id: p.id!,
      partnerName: partner?.name,
      partnerImage: partner?.image,
      displayNumber: p.displayNumber,
      status: p.status,
      priority: p.priority,
      activeTimer: resolveActiveTimer(p),
    };
  }
}
