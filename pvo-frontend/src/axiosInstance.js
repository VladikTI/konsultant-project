import axios from "axios";

export const axiosInstance = axios.create({
    // к запросу будет приуепляться cookies
    withCredentials: true,
    baseURL: "http://127.0.0.1:3000/",
});


// создаем перехватчик запросов
// который к каждому запросу добавляет accessToken из localStorage
//instance.interceptors.request.use(
//    (config) => {
//        alert(JSON.stringify(config));
//        config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
//        return config
//    }
//)


// создаем перехватчик ответов
// который в случае невалидного accessToken попытается его обновить
// и переотправить запрос с обновленным accessToken

//instance.interceptors.response.use(
//    // в случае валидного accessToken ничего не делаем:
//    (config) => {
//        return config;
//    },
//    // в случае просроченного accessToken пытаемся его обновить:
//    async (error) => {
//        // предотвращаем зацикленный запрос, добавляя свойство _isRetry
//        const originalRequest = error.config;
//        if (
//            // проверим, что ошибка именно из-за невалидного accessToken
//            error.response.status === 401 &&
//            // проверим, что запрос не повторный
//            error.config &&
//            !error.config._isRetry
//            ) {
//                originalRequest._isRetry = true;
//            try {
//                // запрос на обновление токенов
//                const resp = await instance.post("/api/refresh");
//                // сохраняем новый accessToken в localStorage
//                localStorage.setItem("token", resp.data.accessToken);
//                // переотправляем запрос с обновленным accessToken
//                return instance.request(originalRequest);
//            } catch (error) {
//                console.log("AUTH ERROR");
//            }
//        }
//        // на случай, если возникла другая ошибка (не связанная с авторизацией)
//        // пробросим эту ошибку
//        throw error;
//    }
//);