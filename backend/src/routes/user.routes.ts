import { Router } from "express";
import { updateProfileController } from "../controllers/user/updateProfileController";

const router = Router();

router.post("/profile", (req, res, next) => {
  Promise.resolve(updateProfileController(req, res)).catch(next);
});

export default router;
