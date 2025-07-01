import { Router } from 'express';
import * as ownerController from './owner.controller';

const router = Router();

router.get('/', ownerController.getAllOwners);

export default router;
