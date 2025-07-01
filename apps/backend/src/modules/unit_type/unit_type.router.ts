import { Router } from 'express';
import * as unitTypeController from './unit_type.controller';

const router = Router();

router.get('/', unitTypeController.getAllUnitTypes);

export default router;
