const fs = require("fs-extra");

fs.moveSync("build", "dist/build", { overwrite: true })