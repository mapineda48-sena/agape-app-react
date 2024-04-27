import EventEmitter from "EventEmitter";
import Router from "Router";
import { BrowserHistory } from "history";
import React from "react";

/**
 * https://github.com/facebook/react/issues/24502
 */
const AppMode =
  process.env.NODE_ENV === "development" ? React.Fragment : React.StrictMode;

export default function App(props: { history: BrowserHistory }) {
  return (
    <AppMode>
      <EventEmitter>
        <Router history={props.history} />
      </EventEmitter>
    </AppMode>
  );
}
