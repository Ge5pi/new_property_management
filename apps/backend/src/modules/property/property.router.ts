import { Router } from 'express';
import * as propertyController from './property.controller';

const router = Router();

router.get('/', propertyController.getAllProperties);

export default router;
