import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';

export async function getTableDataHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { database, table } = req.params;
    
    const prisma = database === 'central' ? getPrismaCentral() : getPrismaBranch();
    
    let data;
    switch (table) {
      case 'stores':
        data = await prisma.store.findMany({ orderBy: { createdAt: 'desc' } });
        break;
      case 'products':
        data = await prisma.product.findMany({ orderBy: { code: 'asc' } });
        break;
      case 'prices':
        data = await prisma.price.findMany({ 
          include: { store: true, product: true },
          orderBy: { createdAt: 'desc' },
          take: 100
        });
        break;
      case 'inventory':
        data = await prisma.inventory.findMany({ 
          include: { store: true, product: true },
          orderBy: { updatedAt: 'desc' }
        });
        break;
      case 'sales':
        data = await prisma.sale.findMany({ 
          include: { store: true },
          orderBy: { timestamp: 'desc' },
          take: 100
        });
        break;
      case 'saleItems':
        data = await prisma.saleItem.findMany({ 
          include: { sale: true, product: true },
          take: 100
        });
        break;
      case 'syncLogs':
        data = await prisma.syncLog.findMany({ 
          include: { sourceStore: true, targetStore: true },
          orderBy: { syncedAt: 'desc' },
          take: 100
        });
        break;
      default:
        res.status(404).json({ error: 'Table not found' });
        return;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
