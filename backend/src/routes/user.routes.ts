import * as express from "express";
import {updateProfileController} from "../controllers/user/updateProfileController.js";

const router = express.Router();

router.post("/profile", updateProfileController);

export default router;
