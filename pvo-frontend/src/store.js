import { makeAutoObservable } from "mobx";
import AuthService from "./api.auth.js";

class AuthStore {
    isAuth = false;
    isAuthInProgress = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async login(email, password) {
        this.isAuthInProgress = true;
        try {
            const resp = await AuthService.login(email, password);
            localStorage.setItem("token", resp.data.accessToken);
            this.isAuth = true;

        } catch (err) {
            console.log("login error");
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async checkAuth() {
        this.isAuthInProgress = true;
        try {
            const resp = await AuthService.refresh();
            localStorage.setItem("token", resp.data.accessToken);
            this.isAuth = true;

        } catch (err) {
            console.log("login error");
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async logout() {
        this.isAuthInProgress = true;
        try {
            await AuthService.logout();
            this.isAuth = false;
            localStorage.removeItem("token");
        } catch (err) {
            console.log("logout error");
        } finally {
            this.isAuthInProgress = false;
        }
    }

}

export default new AuthStore();