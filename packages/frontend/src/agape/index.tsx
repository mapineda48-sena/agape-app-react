import { useRouter } from "app";

export default function Welcome() {
  const app = useRouter();
  return (
    <div
      onClick={() => {
        app.push("/login");
      }}
    >
      Hello Worlds
    </div>
  );
}
