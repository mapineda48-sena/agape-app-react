import Router from "Router";
import ApplicationEvents from "../ApplicationEvent/index";

const Agape = Router(ApplicationEvents);

Agape.use("/", () => import("./Shop/Home"));
Agape.use("/login", () => import("./Login"));
Agape.use("/cms", () => import("./Cms/Inventory/Category"));

export default Agape;
