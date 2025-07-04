import * as express from "express";
import { forwardGeocodeController } from "../controllers/geocoding/forwardGeocodeController";
import { reverseGeocodeController } from "../controllers/geocoding/reverseGeocodeController";

const router = express.Router();

router.get("/forward", forwardGeocodeController);
router.get("/reverse", reverseGeocodeController);

export default router;
