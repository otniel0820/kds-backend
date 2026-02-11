export const PARTNERS_REPOSITORY = Symbol('PARTNERS_REPOSITORY');

export type PartnerLookup = {
  id: string;
  name: string;
  image: string;
};

export interface PartnersRepositoryPort {
  findBySlug(slug: string): Promise<PartnerLookup | null>;
}
