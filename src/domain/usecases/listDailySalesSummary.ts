import { ISaleRepository, DailySalesSummary } from '../repositories/ISaleRepository';

export async function listDailySalesSummary(
  saleRepository: ISaleRepository,
  date: Date
): Promise<DailySalesSummary[]> {
  return await saleRepository.findDailySummary(date);
}
