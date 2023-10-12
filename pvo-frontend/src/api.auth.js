import { instance } from "./api.config.js";

export default class AuthService {

    login (username, password) {
        return instance.post("/api/login", {username, password})
    }

    refreshToken() {
        return instance.get("/api/refresh");
    }

    logout() {
        return instance.post("/api/logout")
    }
}