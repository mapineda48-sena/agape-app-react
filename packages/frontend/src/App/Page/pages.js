const imports = [
  ["/", () => import("App/Shop/Home")],
  ["/about", () => import("App/Shop/About")],
  ["/contact", () => import("App/Shop/Contact")],
  ["/products", () => import("App/Shop/Products")],
  ["/product", () => import("App/Shop/Product")],
  ["/login", () => import("App/Cms/Login")],
  ["/cms", () => import("App/Cms/Welcome")],
  ["/cms/subcategories", () => import("App/Cms/Inventory/SubCategory")],
  ["/cms/products", () => import("App/Cms/Inventory/Product")],
  ["/cms/product", () => import("App/Cms/Inventory/Product/Form")],
];

export default imports;
