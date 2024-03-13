import { glob } from "glob";
import path from "path";
import type { Sequelize } from "sequelize";

const ext = path.extname(__filename);
const pattern = `**/*${ext}`;

export default async function define(sequelize: Sequelize) {
  const files = await glob(pattern, { cwd: __dirname });

  const imports = files.map((file) => import(path.join(__dirname, file)));

  await Promise.all(imports);

  imports
    .filter((mod: any) => "define" in mod)
    .forEach((mod: any) => {
      mod.define(sequelize);
    });


    Object.
}
