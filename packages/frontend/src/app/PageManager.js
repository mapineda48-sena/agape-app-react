import { match } from "path-to-regexp";

export default class PageManager {
  constructor(path, index) {
    this.index = index;
    this.path = path;
    this.match = match(path.pattern, { sensitive: true });
  }

  async init(params, props) {
    await this.import();

    if (!this.OnInit) {
      return { index: this.index, props };
    }

    try {
      return {
        index: this.index,
        props: props ?? (await this.OnInit(params)),
      };
    } catch (error) {
      console.error(error);

      return {
        index: this.index,
      };
    }
  }

  async import() {
    if (this.Component) {
      return;
    }

    // Importa el componente y una función opcional para obtener props desde el servidor.
    const { default: Component, OnInit } = await this.path.import();
    this.Component = Component;
    this.OnInit = OnInit;
  }

  static createInstance(page, index) {
    return new PageManager(page, index);
  }
}
