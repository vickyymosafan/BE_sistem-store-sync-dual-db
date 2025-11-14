import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { ProductRepositoryPrisma } from '../../../infra/repositories/prisma/ProductRepositoryPrisma';
import { createProduct } from '../../../domain/usecases/createProduct';
import { updateProduct } from '../../../domain/usecases/updateProduct';

export async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    const productRepository = new ProductRepositoryPrisma(prismaCentral);
    
    const product = await createProduct(productRepository, req.body);
    
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const prismaCentral = getPrismaCentral();
    const productRepository = new ProductRepositoryPrisma(prismaCentral);
    
    const product = await updateProduct(productRepository, id, req.body);
    
    if (!product) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
      return;
    }
    
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProductHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const prismaCentral = getPrismaCentral();
    const productRepository = new ProductRepositoryPrisma(prismaCentral);
    
    const deleted = await productRepository.delete(id);
    
    if (!deleted) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
      return;
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
}
