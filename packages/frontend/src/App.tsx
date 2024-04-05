import EventEmitter from "EventEmitter";
import Router from "Router";

export default function App() {
  return (
    <EventEmitter>
      <Router />
    </EventEmitter>
  );
}
