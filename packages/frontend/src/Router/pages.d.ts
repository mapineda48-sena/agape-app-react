const pages: Pages[];

export default pages;

export interface IPage {
  index: number;
  pathname: string;
  Component: () => JSX.Element;
  load(params: any): Promise<IState>;
}

export interface IState {
  index: number;
  props?: {};
}
