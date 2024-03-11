import React from "react";
import "./App.css";
import Form, { useOnActionSuccess } from "./Form";
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

  if (!message) {
    return null;
  }

  return <span>{message}</span>;
}

export default App;
