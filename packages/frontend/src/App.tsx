import React, { useEffect, useState } from "react";
import "./App.css";
import Form, { useOnActionSuccess, useEmitter } from "./Form";
import Input from "./Form/Input";
import { sayHello } from "backend/service";

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
  const [state, setState] = useState("");
  const emitter = useEmitter();

  useEffect(() => emitter.on("sayFoo", setState), [emitter]);

  if (!message) {
    return (
      <div>
        <span onClick={() => emitter.sayFoo("foo")}>Emitter</span>
        <span>{state}</span>
      </div>
    );
  }

  return <span>{message}</span>;
}

export default App;
