import { Router } from 'express';
import * as fixedAssetController from './fixed_asset.controller';

const router = Router();

router.get('/', fixedAssetController.getAllFixedAssets);
router.post('/', fixedAssetController.createFixedAsset);
router.get('/:id', fixedAssetController.getFixedAssetById);
router.put('/:id', fixedAssetController.updateFixedAsset);
router.delete('/:id', fixedAssetController.deleteFixedAsset);

export default router;
