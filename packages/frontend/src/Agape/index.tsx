import Router from "Router";

const Agape = Router();

Agape.use("/", () => import("./Shop"));
Agape.use("/login", () => import("./Login"));
Agape.use("/cms", () => import("./Cms/Inventory/Category"));

export default Agape;
