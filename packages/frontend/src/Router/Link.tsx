import { useCallback } from "react";
import { useLocation } from ".";

export default function Link(props: Props) {
  const { href, ...core } = props;
  const push = useLocation();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      push(href);
    },
    [href, push]
  );

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...core} onClick={onClick} />;
}

export interface Props extends CoreProps {
  href: string;
}

type CoreProps = Omit<JSX.IntrinsicElements["a"], "href">;
