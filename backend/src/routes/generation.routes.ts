import * as express from "express";
import { roundRouteController } from "../controllers/route/round/roundRouteController";
import { destRouteController } from "../controllers/route/dest/destRouteController";

const router = express.Router();

router.post("/dest-route", destRouteController);
router.post("/round-route", roundRouteController);

export default router;
