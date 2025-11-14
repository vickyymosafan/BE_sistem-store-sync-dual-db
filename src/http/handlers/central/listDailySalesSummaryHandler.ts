import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { SaleRepositoryPrisma } from '../../../infra/repositories/prisma/SaleRepositoryPrisma';
import { listDailySalesSummary } from '../../../domain/usecases/listDailySalesSummary';
import { toDailySalesSummaryDTO } from '../../../infra/mappers/syncMapper';

export async function listDailySalesSummaryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { date } = req.query;
    const prismaCentral = getPrismaCentral();
    const saleRepository = new SaleRepositoryPrisma(prismaCentral);

    const dateObj = new Date(date as string);
    const summaries = await listDailySalesSummary(saleRepository, dateObj);

    const summaryDTOs = summaries.map(toDailySalesSummaryDTO);

    res.status(200).json(summaryDTOs);
  } catch (error) {
    next(error);
  }
}
