import { PrismaClient } from '@prisma/client';
import { Store } from '../../../domain/entities/Store';
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository';

export class StoreRepositoryPrisma implements IStoreRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Store[]> {
    const stores = await this.prisma.store.findMany();
    return stores.map(this.toDomain);
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });
    return store ? this.toDomain(store) : null;
  }

  async findByCode(code: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { code },
    });
    return store ? this.toDomain(store) : null;
  }

  private toDomain(store: any): Store {
    return {
      id: store.id,
      code: store.code,
      name: store.name,
      type: store.type,
      city: store.city,
      active: store.active,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
    };
  }
}
