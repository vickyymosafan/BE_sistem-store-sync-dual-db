import { PrismaClient } from '@prisma/client';
import { Product } from '../../../domain/entities/Product';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class ProductRepositoryPrisma implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(this.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? this.toDomain(product) : null;
  }

  async findActiveProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { active: true },
    });
    return products.map(this.toDomain);
  }

  async create(data: {
    code: string;
    name: string;
    category: string;
    unit: string;
  }): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        unit: data.unit,
        active: true,
      },
    });
    return this.toDomain(product);
  }

  async update(
    id: string,
    data: {
      code?: string;
      name?: string;
      category?: string;
      unit?: string;
      active?: boolean;
    }
  ): Promise<Product | null> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
    });
    return this.toDomain(product);
  }

  private toDomain(product: any): Product {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      category: product.category,
      unit: product.unit,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
