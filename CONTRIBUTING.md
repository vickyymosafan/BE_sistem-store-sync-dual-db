# Contributing Guide

Terima kasih atas minat Anda untuk berkontribusi pada PT Indo Agustus project! 🎉

## 🚀 Getting Started

1. Fork repository ini
2. Clone fork Anda:
   ```bash
   git clone https://github.com/YOUR_USERNAME/BE_sistem-store-sync-dual-db.git
   ```
3. Ikuti [SETUP.md](SETUP.md) untuk instalasi
4. Buat branch baru untuk fitur/fix Anda:
   ```bash
   git checkout -b feature/nama-fitur
   ```

## 📝 Development Guidelines

### Code Style

Project ini menggunakan:
- **TypeScript** dengan strict mode
- **ESLint** untuk linting
- **Prettier** untuk formatting

Sebelum commit, pastikan code Anda sudah:
```bash
npm run lint:fix    # Fix linting issues
npm run format      # Format code
```

### Commit Messages

Gunakan format commit message yang jelas:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Perubahan formatting (tidak mengubah logic)
- `refactor`: Refactoring code
- `test`: Menambah atau update tests
- `chore`: Maintenance tasks

**Contoh:**
```
feat(sync): add automatic retry for failed sync

- Implement exponential backoff
- Add max retry configuration
- Log retry attempts

Closes #123
```

### Architecture Guidelines

Project menggunakan **Clean Architecture** dengan 3 layers:

1. **Domain Layer** (`src/domain/`)
   - Pure business logic
   - Tidak boleh import dari infra atau http layer
   - Entities, repositories interfaces, use cases

2. **Infrastructure Layer** (`src/infra/`)
   - Technical implementations
   - Database, external services
   - Repository implementations, mappers

3. **HTTP Layer** (`src/http/`)
   - Web API
   - Routes, handlers, middleware, validation

**Rules:**
- Domain layer tidak boleh depend pada layer lain
- Infra layer boleh depend pada domain
- HTTP layer boleh depend pada domain dan infra
- Gunakan dependency injection

### File Naming Conventions

- **TypeScript files**: camelCase (`createProduct.ts`)
- **Interfaces**: Prefix dengan `I` (`IProductRepository.ts`)
- **Mappers**: Suffix dengan `Mapper` (`productMapper.ts`)
- **Schemas**: Suffix dengan `Schemas` (`priceSchemas.ts`)

### Adding New Features

#### 1. Tambah Entity Baru

```typescript
// src/domain/entities/NewEntity.ts
export interface NewEntity {
  id: string;
  name: string;
  // ... properties
}
```

#### 2. Tambah Repository Interface

```typescript
// src/domain/repositories/INewEntityRepository.ts
import { NewEntity } from '../entities/NewEntity';

export interface INewEntityRepository {
  findAll(): Promise<NewEntity[]>;
  findById(id: string): Promise<NewEntity | null>;
  create(data: Omit<NewEntity, 'id'>): Promise<NewEntity>;
  // ... methods
}
```

#### 3. Tambah Use Case

```typescript
// src/domain/usecases/createNewEntity.ts
import { NewEntity } from '../entities/NewEntity';
import { INewEntityRepository } from '../repositories/INewEntityRepository';

export default async function createNewEntity(
  repository: INewEntityRepository,
  data: Omit<NewEntity, 'id'>
): Promise<NewEntity> {
  // Business logic here
  return await repository.create(data);
}
```

#### 4. Implement Repository

```typescript
// src/infra/repositories/prisma/PrismaNewEntityRepository.ts
import { PrismaClient } from '@prisma/client';
import { INewEntityRepository } from '../../../domain/repositories/INewEntityRepository';
import { NewEntity } from '../../../domain/entities/NewEntity';
import { newEntityMapper } from '../../mappers/newEntityMapper';

export class PrismaNewEntityRepository implements INewEntityRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<NewEntity[]> {
    const records = await this.prisma.newEntity.findMany();
    return records.map(newEntityMapper.toDomain);
  }

  // ... implement other methods
}
```

#### 5. Tambah Mapper

```typescript
// src/infra/mappers/newEntityMapper.ts
import { NewEntity as PrismaNewEntity } from '@prisma/client';
import { NewEntity } from '../../domain/entities/NewEntity';

export const newEntityMapper = {
  toDomain(prisma: PrismaNewEntity): NewEntity {
    return {
      id: prisma.id,
      name: prisma.name,
      // ... map properties
    };
  },

  toPrisma(domain: NewEntity): PrismaNewEntity {
    return {
      id: domain.id,
      name: domain.name,
      // ... map properties
    };
  },
};
```

#### 6. Tambah Handler

```typescript
// src/http/handlers/newEntity/createNewEntityHandler.ts
import { Request, Response } from 'express';
import createNewEntity from '../../../domain/usecases/createNewEntity';
import { PrismaNewEntityRepository } from '../../../infra/repositories/prisma/PrismaNewEntityRepository';
import { prismaClientCentral } from '../../../infra/db/prismaClientCentral';

export async function createNewEntityHandler(req: Request, res: Response) {
  try {
    const repository = new PrismaNewEntityRepository(prismaClientCentral);
    const result = await createNewEntity(repository, req.body);
    res.status(201).json(result);
  } catch (error) {
    throw error; // Will be caught by error middleware
  }
}
```

#### 7. Tambah Route

```typescript
// src/http/routes/newEntityRoutes.ts
import { Router } from 'express';
import { createNewEntityHandler } from '../handlers/newEntity/createNewEntityHandler';
import { validate } from '../middleware/validationMiddleware';
import { createNewEntitySchema } from '../schemas/newEntitySchemas';

const router = Router();

router.post('/', validate(createNewEntitySchema), createNewEntityHandler);

export default router;
```

#### 8. Tambah Validation Schema

```typescript
// src/http/schemas/newEntitySchemas.ts
import { z } from 'zod';

export const createNewEntitySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    // ... validation rules
  }),
});
```

### Database Changes

#### Menambah Tabel/Field Baru

1. Edit `prisma/schema.prisma`:
```prisma
model NewEntity {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
}
```

2. Generate migration:
```bash
npx prisma migrate dev --name add_new_entity
```

3. Generate Prisma Client:
```bash
npm run db:generate
```

4. Update seed script jika perlu:
```typescript
// prisma/seed.ts
await prisma.newEntity.createMany({
  data: [
    { name: 'Example 1' },
    { name: 'Example 2' },
  ],
});
```

### Testing

```bash
# Run tests (coming soon)
npm test

# Run specific test
npm test -- newEntity.test.ts

# Run with coverage
npm test -- --coverage
```

### Documentation

- Update README.md jika menambah fitur besar
- Tambah JSDoc comments untuk functions/classes
- Update SETUP.md jika ada perubahan setup
- Update steering rules di `../.kiro/steering/` jika perlu

## 🔍 Pull Request Process

1. Pastikan code Anda sudah:
   - Lulus linting: `npm run lint`
   - Formatted: `npm run format`
   - Build berhasil: `npm run build`
   - Tests pass: `npm test` (jika ada)

2. Update dokumentasi jika perlu

3. Buat Pull Request dengan deskripsi yang jelas:
   - Apa yang diubah?
   - Kenapa perubahan ini diperlukan?
   - Bagaimana cara test perubahan ini?
   - Screenshot (jika ada perubahan UI)

4. Link ke issue yang terkait (jika ada)

5. Tunggu review dari maintainer

## 🐛 Reporting Bugs

Gunakan GitHub Issues dengan template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Node version: [e.g. 18.17.0]
- PostgreSQL version: [e.g. 14.5]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

Gunakan GitHub Issues dengan label `enhancement`:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context or screenshots.
```

## 📚 Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## 📞 Contact

Jika ada pertanyaan, silakan:
- Buka issue di GitHub
- Contact: vickymosafan

---

Thank you for contributing! 🙏
