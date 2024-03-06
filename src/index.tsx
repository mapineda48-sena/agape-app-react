import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from './App';
import reportWebVitals from "./reportWebVitals";
import Router, { useBaseUrl } from "./Route";
import Rcp from "./Dev";

const Bar = Router((props) => (
  <div>
    menu<div>{props.children}</div>
  </div>
));

Bar.use("/", () => {
  const changeTo = useBaseUrl();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        changeTo("/foo");
      }}
    >
      Go to foo
    </div>
  );
});

Bar.use("/foo", () => {
  const changeTo = useBaseUrl();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        changeTo("/");
      }}
    >
      foo
    </div>
  );
});

const App = Router((props) => (
  <div>
    menu<div>{props.children}</div>
  </div>
));

App.use("/", () => {
  const changeTo = useBaseUrl();

  return <div onClick={() => changeTo("/foo")}>Go to foo</div>;
});

App.use("/foo", () => {
  const changeTo = useBaseUrl();

  return <div onClick={() => changeTo("/")}>foo</div>;
});

App.use("/bar", Bar);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Rcp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
