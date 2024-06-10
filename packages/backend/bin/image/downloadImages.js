const fetch = require("node-fetch-commonjs");
const { AbortController } = require("abort-controller");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const ms = require("ms");

const numImages = 10; // Número de imágenes a descargar

async function downloadImage(url, dirname) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, ms("5m"));

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    clearTimeout(timeout);

    const filepath = path.join(dirname, path.basename(url));
    fs.writeFile(filepath, buffer, () =>
      console.log(`Downloaded: ${filepath}`)
    );
  } catch (error) {
    if (error.name === "AbortError") {
      console.error(`Download aborted for ${url}`);
    } else {
      console.error(`Failed to download ${url}:`, error.message);
    }
  }
}

async function getImageUrls(keyword, numImages) {
  const encodedKeyword = encodeURIComponent(keyword);
  const response = await fetch(
    `https://www.bing.com/images/search?q=${encodedKeyword}`
  );
  const body = await response.text();
  const $ = cheerio.load(body);
  const imageUrls = [];

  $("a.iusc").each((i, element) => {
    if (i < numImages) {
      const m = $(element).attr("m");
      const metadata = JSON.parse(m);
      const imageUrl = metadata.murl;
      imageUrls.push(imageUrl);
    }
  });

  console.log(imageUrls);

  return imageUrls;
}

module.exports = async function main(keyword, dirname) {
  const imageUrls = await getImageUrls(keyword, numImages);

  return Promise.all(imageUrls.map((url) => downloadImage(url, dirname)));
};
