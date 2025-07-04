import express from "express";
import baseRouter from "../routes/routes.js"; // adjust path if needed
import serverless from "serverless-http";
import dotenv from "dotenv";
import { sampleRoute1, sampleRoute2 } from "../utils/sample_route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/sample1", (req, res) => {
  res.status(200).json(sampleRoute1);
});

app.get("/sample2", (req, res) => {
  res.status(200).json(sampleRoute2);
});

app.use("/api", baseRouter);

export const handler = serverless(app);
