import rpc from "../call/browser.js"

export let isAuth = false;

export const login = (() => {
    const login = rpc("/service/auth/login");

    return (...args) => login(...args).then(res => {
        isAuth = true;

        return res;
    })
})();

export const logout = (() => {
    const logout = rpc("/service/auth/logout");

    return (...args) => logout(...args).then(res => {
        isAuth = false;

        return res;
    })
})();


export const isAuthenticated = (() => {
    const isAuthenticated = rpc("/service/auth/isAuthenticated");

    return (...args) => isAuthenticated(...args).then(state => {
        isAuth = state;

        return state;
    })
})();