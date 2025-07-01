import { Router } from 'express';
import * as unitController from './unit.controller';

const router = Router();

router.get('/', unitController.getAllUnits);

export default router;
