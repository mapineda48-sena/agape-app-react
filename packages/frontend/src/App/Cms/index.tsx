import { Fragment, ReactNode } from "react";
import Menu from "./Menu";

export default function Cms(props: { children: ReactNode }) {
  return (
    <Fragment>
      <Menu />
      {props.children}
    </Fragment>
  );
}
