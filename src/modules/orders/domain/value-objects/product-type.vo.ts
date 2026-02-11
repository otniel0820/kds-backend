export type ProductTypeValue = 'COMBO' | 'SIDE' | 'DRINK' | 'DESSERT' | 'SAUCE';

export class ProductType {
  private constructor(private readonly value: ProductTypeValue) {}

  private static readonly VALUES: Record<ProductTypeValue, ProductType> = {
    COMBO: new ProductType('COMBO'),
    SIDE: new ProductType('SIDE'),
    DRINK: new ProductType('DRINK'),
    DESSERT: new ProductType('DESSERT'),
    SAUCE: new ProductType('SAUCE'),
  };

  static from(value: ProductTypeValue): ProductType {
    const type = this.VALUES[value];
    if (!type) {
      throw new Error(`Invalid ProductType: ${value}`);
    }
    return type;
  }

  equals(other: ProductType): boolean {
    return this.value === other.value;
  }

  toString(): ProductTypeValue {
    return this.value;
  }
}
