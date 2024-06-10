const fs = require("fs-extra");
const path = require("path");
const mime = require("mime");
const { Client } = require("minio");
const product = require("../../.data/product.json");

const server = "http://minio:minio123@127.0.0.1:9000";
const bucket = "agape";
const publicPath = "public/";
const expiry = 24 * 60 * 60; // Expiración para URLs presignadas

const { hostname, username, password, port, protocol } = new URL(server);

const minioClient = new Client({
  endPoint: decodeURIComponent(hostname),
  accessKey: decodeURIComponent(username),
  secretKey: decodeURIComponent(password),
  port: port ? parseInt(port) : undefined,
  useSSL: protocol === "https:",
});

(async function main() {
  const res = {};

  const tasks = Object.entries(product)
    .map(([c, s]) => {
      res[c] = {};
      return Object.entries(s).map(([s, p]) => {
        res[c][s] = {};
        return Object.entries(p).map(([p, files]) => {
          res[c][s][p] = [];
          return files.map(async (file) => {
            const web = await toFileWeb(file);
            res[c][s][p].push(await uploadFile(web, `${c}/${s}/${p}`));
          });
        });
      });
    })
    .flat(4);

  console.log(tasks);

  await Promise.all(tasks);

  await fs.outputJSON(path.resolve(".data/storage.json"), res);
})().catch(console.error);

let foo;

async function uploadFile(file, dirname = "") {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const objectName = publicPath + dirname + file.name;

  await minioClient.putObject(bucket, objectName, buffer, {
    "Content-Type": file.type,
  });

  const url = new URL(
    await minioClient.presignedGetObject(bucket, objectName, expiry)
  );

  //   if (!foo) {
  //     console.log(url);
  //     foo = true;
  //   }

  return url.origin + url.pathname;
}

async function toFileWeb(input) {
  const stats = await fs.stat(input);

  const file = {
    name: path.basename(input),
    size: stats.size,
    type: mime.getType(input),

    arrayBuffer: function arrayBuffer() {
      return fs
        .readFile(input)
        .then((res) =>
          res.buffer.slice(res.byteOffset, res.byteOffset + res.byteLength)
        );
    },

    stream: function stream() {
      return fs.createReadStream(input);
    },
  };

  return file;
}
