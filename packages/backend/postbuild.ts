import fs from "fs-extra";
import { name, version, dependencies } from "./package.json";

fs.outputJSONSync(
  "dist/package.json",
  {
    name,
    version,
    private: true,
    scripts: {
      start: "node bin/index.js",
    },
    dependencies,
  },
  { spaces: 2 }
);

fs.copySync("../frontend/build", "dist/build", { overwrite: true });

fs.copySync("dist", "../../dist", { overwrite: true });