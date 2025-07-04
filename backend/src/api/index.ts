import express from "express";
import baseRouter from "../routes/routes.js";
import serverless from "serverless-http";
import dotenv from "dotenv";
import { sampleRoute1, sampleRoute2 } from "../utils/sample_route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
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

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
