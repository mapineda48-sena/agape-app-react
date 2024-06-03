import express from "express";
import path from "path";

const build = path.resolve("build");
const index = path.resolve("build/index.html");

export default function reactAppMiddleware() {
  const router = express.Router();

  router.use(express.static(build));
  router.get("*", (req, res) => res.sendFile(index));

  return router;
}
