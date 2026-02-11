export const PRODUCTS_REPOSITORY = Symbol('PRODUCTS_REPOSITORY');

export interface ProductsRepositoryPort {
  findBySlugs(slugs: string[]): Promise<{ id: string; slug: string }[]>;
}
