import fs from "fs-extra";
import { name, version, engines, dependencies } from "./package.json";

fs.outputJSONSync(
  "dist/package.json",
  {
    name,
    version,
    private: true,
    engines: {
      node: engines.node,
    },
    scripts: {
      start: "node bin/index.js",
    },
    dependencies,
  },
  { spaces: 2 }
);

fs.copySync("build", "dist/build", { overwrite: true });
