import { useCallback } from "react";
import { useRouter } from ".";

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

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...core} onClick={onClick} />;
}

export interface Props extends CoreProps {
  href: string;
}

type CoreProps = Omit<JSX.IntrinsicElements["a"], "href">;
