const pages = [
    [
        "/",
        () => import("Shop/Home")
    ],
    [
        "/about",
        () => import("Shop/About")
    ],
    [
        "/contact",
        () => import("Shop/Contact")
    ],
    [
        "/products",
        () => import("Shop/Products")
    ],
    [
        "/product",
        () => import("Shop/Product")
    ],
    [
        "/login",
        () => import("App/Login")
    ],
    [
        "/cms",
        () => import("Cms/Inventory/Category")
    ],
    [
        "/cms/subcategories",
        () => import("Cms/Inventory/SubCategory")
    ],
    [
        "/cms/product",
        () => import("Cms/Inventory/Product")
    ]
] as const;

export default pages