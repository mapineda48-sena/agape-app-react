import makeRcp from "../browser.js"

export let isAuth = false;

export const login = (() => {
    const login = makeRcp("/service/auth/login");

    return (...args) => login(...args).then(res => {
        isAuth = true;

        return res;
    })
})();

export const logout = (() => {
    const logout = makeRcp("/service/auth/logout");

    return (...args) => logout(...args).then(res => {
        isAuth = false;

        return res;
    })
})();

export const isAuthenticated = makeRcp("/service/auth/isAuthenticated");

export const sync = isAuthenticated().then(state => {
    isAuth = state
}).catch(error => { })