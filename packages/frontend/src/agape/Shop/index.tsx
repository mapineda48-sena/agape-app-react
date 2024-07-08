import { Fragment, ReactNode } from "react";
import Menu from "./Menu";
import Footer from "./Footer";

export default function Shop(props: { children: ReactNode }) {
  return (
    <Fragment>
      <Menu />
      {props.children}
      <Footer />
    </Fragment>
  );
}
