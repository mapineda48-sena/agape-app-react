import fs from "fs-extra";
import { dependencies } from "./package.json";
import { name, version } from "../../package.json";

fs.outputJSONSync(
  "dist/package.json",
  {
    name,
    version,
    private: true,
    scripts: {
      start: "node bin/cluster.js",
    },
    dependencies,
  },
  { spaces: 2 }
);

fs.copySync("dist", "../../dist", { overwrite: true });
