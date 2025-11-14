import { Router } from 'express';
import { listStoresHandler } from '../handlers/central/listStoresHandler';
import { listProductsHandler } from '../handlers/central/listProductsHandler';
import { listActivePricesHandler } from '../handlers/central/listActivePricesHandler';
import { listAllPricesHandler } from '../handlers/central/listAllPricesHandler';
import { createOrUpdatePriceHandler } from '../handlers/central/createOrUpdatePriceHandler';
import { syncBranchSalesToCentralHandler } from '../handlers/central/syncBranchSalesToCentralHandler';
import { syncPricesToBranchHandler } from '../handlers/central/syncPricesToBranchHandler';
import { listDailySalesSummaryHandler } from '../handlers/central/listDailySalesSummaryHandler';
import { createProductHandler, updateProductHandler, deleteProductHandler } from '../handlers/central/productManagementHandler';
import { getSyncLogsHandler } from '../handlers/central/syncLogsHandler';
import { validateParams, validateBody, validateQuery } from '../middleware/validationMiddleware';
import { storeIdParamSchema } from '../schemas/commonSchemas';
import { createPriceRequestSchema } from '../schemas/priceSchemas';
import { dailySalesQuerySchema } from '../schemas/reportSchemas';

const router = Router();

// Master data routes
router.get('/stores', listStoresHandler);
router.get('/products', listProductsHandler);
router.post('/products', createProductHandler);
router.put('/products/:id', updateProductHandler);
router.delete('/products/:id', deleteProductHandler);
router.get('/prices/:storeId', validateParams(storeIdParamSchema), listAllPricesHandler);
router.get('/prices/:storeId/active', validateParams(storeIdParamSchema), listActivePricesHandler);

// Price management routes
router.post('/prices', validateBody(createPriceRequestSchema), createOrUpdatePriceHandler);
router.post(
  '/sync/prices/:storeCode',
  syncPricesToBranchHandler
);

// Sync routes
router.post('/sync/sales', syncBranchSalesToCentralHandler);
router.get('/sync-logs', getSyncLogsHandler);

// Reporting routes
router.get(
  '/reports/daily-sales',
  validateQuery(dailySalesQuerySchema),
  listDailySalesSummaryHandler
);

export default router;
