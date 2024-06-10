const path = require("path");
const glob = require("glob");
const fs = require("fs-extra");

const root = path.resolve(".data");

const files = glob
  .sync("**/*", { cwd: root, nodir: true })
  .filter((file) => !hasExtension(file));

console.log(files);

files.forEach((file) => {
  const src = path.join(root, file);
  const dest = path.join(root, file + ".jpg");

  fs.renameSync(src, dest);
});

function hasExtension(filePath) {
  const extension = path.extname(filePath);
  return extension !== "";
}
