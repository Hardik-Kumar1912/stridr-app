import * as express from "express";
import { forwardGeocodeController } from "../controllers/geocoding/forwardGeocodeController.js";
import { reverseGeocodeController } from "../controllers/geocoding/reverseGeocodeController.js";

const router = express.Router();

router.get("/forward", forwardGeocodeController);
router.get("/reverse", reverseGeocodeController);

export default router;
