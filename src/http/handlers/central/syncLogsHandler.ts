import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';

export async function getSyncLogsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    
    const logs = await prismaCentral.syncLog.findMany({
      include: {
        sourceStore: true,
        targetStore: true,
      },
      orderBy: { syncedAt: 'desc' },
      take: 50,
    });
    
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
}
