export default [
    [
        "/",
        () => import("App/Shop/Home")
    ],
    [
        "/about",
        () => import("App/Shop/About")
    ],
    [
        "/contact",
        () => import("App/Shop/Contact")
    ],
    [
        "/products",
        () => import("App/Shop/Products")
    ],
    [
        "/product",
        () => import("App/Shop/Product")
    ],
    [
        "/login",
        () => import("App/Cms/Login")
    ],
    [
        "/cms",
        () => import("App/Cms/Welcome")
    ],
    [
        "/cms/subcategories",
        () => import("App/Cms/Inventory/SubCategory")
    ],
    [
        "/cms/product",
        () => import("App/Cms/Inventory/Product")
    ]
];