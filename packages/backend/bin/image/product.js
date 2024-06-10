const fs = require("fs-extra");
const path = require("path");
const downloadImages = require("./downloadImages");

const root = path.resolve(".data");

const res = {};

Object.entries(require("../../lib/demo/data/products.json"))
  .map(([category, subcategories]) => {
    const c = path.resolve(root, category);

    if (!fs.existsSync(c)) {
      console.log(`Creada Categoria: ${c}`);
      fs.mkdirSync(c);
    }

    res[category] = res[category] || {};

    return subcategories.map(({ SubCategory, Products }) => {
      const s = path.join(c, SubCategory);

      if (!fs.existsSync(s)) {
        console.log(`Creada SubCategoria: ${s}`);
        fs.mkdirSync(s);
      }

      res[category][SubCategory] = res[category][SubCategory] || {};

      return Products.map(({ fullName }) => {
        const p = path.join(s, fullName);

        if (!fs.existsSync(p)) {
          console.log(`Creada Producto: ${p}`);
          fs.mkdirSync(p);
        }

        if (!fs.readdirSync(p).length) {
          downloadImages(fullName, p).catch(console.error);
        } else {
          res[category][SubCategory][fullName] = fs
            .readdirSync(p)
            .map((f) => path.join(p, f));
        }

        return [fullName, p];
      });
    });
  })
  .flat(2);

fs.outputJSONSync(".data/product.json", res);
