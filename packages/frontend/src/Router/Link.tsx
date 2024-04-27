import { useCallback } from "react";
import { useRouter } from ".";
import clsx from "clsx";
import h from "history/browser";

export default function Link(props: Props) {
  const { href, ...core } = props;
  const history = useRouter();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      history.push(href);
    },
    [href, history]
  );

  // aria-current="page"

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...core} className={clsx([props.className, h.location.pathname === href && "active"])} aria-current={h.location.pathname === href ? "page" : false} style={{ cursor: "pointer" }} onClick={onClick} />;
}

export interface Props extends CoreProps {
  href: string;
}

type CoreProps = Omit<JSX.IntrinsicElements["a"], "href">;
