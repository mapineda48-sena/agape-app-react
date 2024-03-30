import Link from "Router/Link";
import { useLocation } from "Router/Router";

export function fetchProps() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ message: "Hello World" });
    }, 1000);
  });
}

export default function Home(props: { message: string }) {
  const location = useLocation();

  return (
    <span>
      Home - {props.message} -{" "}
      <span onClick={() => location("/foo")}>gooooo</span>
      <br />
    </span>
  );
}
