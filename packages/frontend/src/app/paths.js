// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    pattern: "/",
    import: () => import("agape/Shop/Home"),
  },
  {
    pattern: "/about",
    import: () => import("agape/Shop/About"),
  },
  {
    pattern: "/contact",
    import: () => import("agape/Shop/Contact"),
  },
  {
    pattern: "/products",
    import: () => import("agape/Shop/Products"),
  },
  {
    pattern: "/product",
    import: () => import("agape/Shop/Product"),
  },
  {
    pattern: "/login",
    import: () => import("agape/Login"),
  },
  {
    pattern: "/cms",
    import: () => import("agape/Cms"),
  },
  {
    pattern: "/cms/inventory",
    import: () => import("agape/Cms/Inventory/Product"),
  },
  {
    pattern: "/cms/customers",
    import: () => import("agape/Cms/Customers"),
  },
  {
    pattern: "/joo",
    import: () => import("agape/joo"),
  },
];
