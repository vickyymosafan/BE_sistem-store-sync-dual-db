import { Router } from 'express';
import { listBranchInventoryHandler } from '../handlers/branch/listBranchInventoryHandler';
import { createBranchSaleHandler } from '../handlers/branch/createBranchSaleHandler';
import { listBranchSalesHandler } from '../handlers/branch/listBranchSalesHandler';
import { getBranchProductsHandler, getBranchStoresHandler } from '../handlers/branch/branchDataHandler';
import { validateBody, validateQuery } from '../middleware/validationMiddleware';
import { createSaleRequestSchema, listSalesQuerySchema } from '../schemas/saleSchemas';

const router = Router();

// Branch data routes
router.get('/bondowoso/products', getBranchProductsHandler);
router.get('/bondowoso/stores', getBranchStoresHandler);
router.get('/bondowoso/inventory', listBranchInventoryHandler);

// Branch sales routes
router.post(
  '/bondowoso/sales',
  validateBody(createSaleRequestSchema),
  createBranchSaleHandler
);

router.get(
  '/bondowoso/sales',
  validateQuery(listSalesQuerySchema),
  listBranchSalesHandler
);

export default router;
