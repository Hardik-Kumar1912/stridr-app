import * as express from "express";
import { updateProfileController } from "../controllers/user/updateProfileController";

const router = express.Router();

// router.use("/uploadthing");
router.post("/profile", updateProfileController);

export default router;
