import app from "./app";

app.use("/", () => import("Shop/Home"));
app.use("/about", () => import("Shop/About"));
app.use("/contact", () => import("Shop/Contact"));
app.use("/products", () => import("Shop/Products"));
app.use("/product", () => import("Shop/Product"));

app.use("/login", () => import("Login"));

app.use("/cms", () => import("Cms/Inventory/Category"));
