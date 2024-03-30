module.exports = require
  .context("../Page/", true, /\.tsx$/)
  .keys()
  .filter((path) => path.startsWith("."))
  .map(toPage);

console.log(module.exports);

function toPage(path, index) {
  return {
    index,
    pathname: toPathNameLocation(path),
    getPropsFormServer: null,
    Component: null,

    async load(params) {
      if (!this.Component) {
        await this.import();
      }

      if (!this.getPropsFormServer) {
        return { index };
      }

      try {
        const props = await this.getPropsFormServer();

        return { index, props };
      } catch (error) {
        return { index, props: { error } };
      }
    },

    async import() {
      const relative = path.replace(/^\.\//, "");

      const { default: Component, fetchProps } = await import(
        `../Page/${relative}`
      );

      this.Component = Component;
      this.getPropsFormServer = fetchProps;
    },
  };
}

function toPathNameLocation(path) {
  return path
    .replace(/^\./, "")
    .replace(/\.tsx$/, "")
    .replace(/index$/, "")
    .toLocaleLowerCase();
}

//import("./Router").then(console.log);
