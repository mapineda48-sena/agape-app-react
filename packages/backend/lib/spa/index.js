const express = require("express");
const path = require("path");

const build = path.resolve("build");
const index = path.resolve("build/index.html");

module.exports = function reactAppMiddleware() {
  const router = express.Router();

  router.use(express.static(build));
  router.get("*", (req, res) => res.sendFile(index));

  return router;
}
