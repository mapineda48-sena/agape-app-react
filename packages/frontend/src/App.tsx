import React from "react";
import "./App.css";
import Form, { useOnActionSuccess, useOnEvent } from "./Form";
import Input from "./Form/Input";
import { sayHello } from "backend/rpc";

function App() {
  return (
    <Form action={sayHello}>
      <Input.Text name="fullName" />
      <Input.Text name="foo.fullName" />
      <Success />
      <input type="submit" value="Enviar" />
    </Form>
  );
}

function Success() {
  const message = useOnActionSuccess<string>();

  useOnEvent("foo", (payload: any) => {
    console.log(payload);
  });

  if (!message) {
    return null;
  }

  return <span>{message}</span>;
}

export default App;
