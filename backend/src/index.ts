import express from "express";
import baseRouter from "./routes/routes.js";
// import { clerkMiddleware, requireAuth } from "@clerk/express";
import dotenv from "dotenv";
import { sampleRoute1, sampleRoute2 } from "./utils/sample_route.js";
dotenv.config();

const app = express();
app.use(express.json());
// app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/sample1", (req, res) => {
  res.status(200).json(sampleRoute1);
});

app.get("/sample2", (req, res) => {
  res.status(200).json(sampleRoute2);
});

app.use(
  "/api",
  // requireAuth(),
  baseRouter
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
