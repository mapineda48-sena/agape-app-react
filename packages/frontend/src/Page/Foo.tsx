import { useLocation } from "Router/Router";

export default function Foo() {
  const location = useLocation();

  return (
    <>
      <span onClick={() => location("/")}>Foo</span>
    </>
  );
}
