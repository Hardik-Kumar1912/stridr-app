import * as express from "express";
import { roundRouteController } from "../controllers/route/round/roundRouteController.js";
import { destRouteController } from "../controllers/route/dest/destRouteController.js";

const router = express.Router();

router.post("/dest-route", destRouteController);
router.post("/round-route", roundRouteController);

export default router;
