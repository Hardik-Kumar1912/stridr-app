import express from "express";
import userRouter from "./user.routes.js";
import geocodingRouter from "./geocoding.routes.js";
import generationRouter from "./generation.routes.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/geocoding", geocodingRouter);
router.use("/generation", generationRouter);


export default router;