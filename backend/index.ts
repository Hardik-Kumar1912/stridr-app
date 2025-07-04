import express from "express";
import baseRouter from "./routes/routes.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api", requireAuth(), baseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
