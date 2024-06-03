import { BaseError } from "sequelize";
import type { ErrorRequestHandler as OnError } from "express";

export const onErrorMiddleware: OnError = (error, req, res, next) => {
  console.error(error);

  if (error instanceof BaseError) {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({ message: "Ups... Something Wrong" });
};
