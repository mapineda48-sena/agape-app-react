import express from "express";

export default function reactAppMiddleware() {
  const router = express.Router();

  router.use(express.static("build"));

  return router;
}
