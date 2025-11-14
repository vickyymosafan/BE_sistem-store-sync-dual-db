import { Router } from 'express';
import { getTableDataHandler } from '../handlers/admin/adminTablesHandler';

const router = Router();

router.get('/tables/:database/:table', getTableDataHandler);

export default router;
