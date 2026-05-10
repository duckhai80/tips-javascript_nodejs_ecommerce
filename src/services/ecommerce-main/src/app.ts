import "@/configs/env.config";
import router from "@/routes";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import createHttpError from "http-errors";
import morgan from "morgan";
import { ErrorResponse } from "./core";
import inventoryServiceTest from "./tests/inventory-service.test";
import productServiceTest from "./tests/product-service.test";

const app = express();

// Init middleware
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Define routes
app.use("/", router);

// Handling errors
app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});
app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      // In production, we should not return the stack trace
      stack: error.stack,
      message: error.message || "Internal Server Error",
    });
  },
);

// Test pub/sub Redis
productServiceTest.purchaseProduct("product:001", 10);
inventoryServiceTest;

export { app };
