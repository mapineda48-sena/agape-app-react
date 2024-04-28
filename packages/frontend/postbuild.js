const fs = require("fs-extra");

fs.moveSync("build/index.html", "dist/index.html", { overwrite: true })
fs.moveSync("build", "dist/build", { overwrite: true })
