import { createContext, useState, useEffect, useContext } from 'react';
//import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../axiosInstance.js";

export const authContext = createContext({});

const dayjs = require('dayjs')

export const AuthStatus = {UNAUTHORIZED: 0, AUTHORIZED: 1, PENDING_AUTH: 2, PENDING_REFRESH: 3};

export function AuthProvider ({ children }) {
    const [authStatus,          setAuthStatus]          = useState(AuthStatus.AUTHORIZED);
    const [userInfo,            setUserInfo]            = useState(null);
    const [authToken,           setAuthToken]           = useState(null);
    const [authTokenExpire,     setAuthTokenExpire]     = useState(null);
    const [refreshToken,        setRefreshToken]        = useState(null);
    const [refreshTokenExpire,  setRefreshTokenExpire]  = useState(null);

    //const navigate = useNavigate();

    async function login (username, password) {
        setAuthStatus(AuthStatus.PENDING_AUTH);
        try {
            let response = await axiosInstance.post( "/auth", { username: username, password: password } );

            setUserInfo             (response.data.userInfo);
            setAuthToken            (response.data.token);
            setAuthTokenExpire      (response.data.token_expire_date);
            setRefreshToken         (response.data.refresh_token);
            setRefreshTokenExpire   (response.data.refresh_token_expire_date);

            localStorage.setItem("userInfo",            response.data.userInfo);
            localStorage.setItem("authToken",           response.data.token);
            localStorage.setItem("authTokenExpire",     response.data.token_expire_date);
            localStorage.setItem("refreshToken",        response.data.refresh_token);
            localStorage.setItem("refreshTokenExpire",  response.data.refresh_token_expire_date);

            setAuthStatus(AuthStatus.AUTHORIZED);
        }
        catch (error) {
            console.error(error);
            setAuthStatus(AuthStatus.UNAUTHORIZED)
        }
        return;
    };

    async function logout (){
        setAuthStatus(AuthStatus.UNAUTHORIZED);

        localStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        localStorage.removeItem("authTokenExpire");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshTokenExpire");
    };

    async function postWithAuth(path, body){
        if (authStatus == AuthStatus.UNAUTHORIZED) {
            //navigate("/login");
            return;
        }
        if (authStatus == AuthStatus.PENDING_AUTH || 
            authStatus == AuthStatus.PENDING_REFRESH) {
                
            await new Promise(resolve => setTimeout(resolve, 100));
            postWithAuth(body);
        }
        if (authStatus == AuthStatus.AUTHORIZED) {
            return axiosInstance.post(path, body, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                }
            });
        }
    };

    async function getWithAuth(path){
        if (authStatus == AuthStatus.UNAUTHORIZED) {
            //navigate("/login");
            return;
        }
        if (authStatus == AuthStatus.PENDING_AUTH || 
            authStatus == AuthStatus.PENDING_REFRESH) {
                
            await new Promise(resolve => setTimeout(resolve, 100));
            getWithAuth(path);
        }
        if ( authStatus == AuthStatus.AUTHORIZED ) {
            return axiosInstance.get(path, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                }
            });
        }
    }

    async function refreshAccessToken(){
        if (authStatus == AuthStatus.UNAUTHORIZED) {
            //navigate("/login");
            return;
        }
        if (authStatus == AuthStatus.PENDING_AUTH || 
            authStatus == AuthStatus.PENDING_REFRESH) {
                
            await new Promise(resolve => setTimeout(resolve, 100));
            refreshAccessToken();
        }
        if (authStatus == AuthStatus.AUTHORIZED) {
            setAuthStatus(AuthStatus.PENDING_REFRESH);
            try {
                let response = await axiosInstance.post("/api/refresh", {}, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                        'Content-Type': 'application/json',
                    }
                });
                
                setAuthToken            (response.data.token);
                setAuthTokenExpire      (response.data.token_expire_date);
                setRefreshToken         (response.data.refresh_token);
                setRefreshTokenExpire   (response.data.refresh_token_expire_date);

                localStorage.setItem("authToken",           authToken);
                localStorage.setItem("authTokenExpire",     authTokenExpire);
                localStorage.setItem("refreshToken",        refreshToken);
                localStorage.setItem("refreshTokenExpire",  refreshTokenExpire);
        
                setAuthStatus(AuthStatus.AUTHORIZED);
            }
            catch (error) {
                console.error(error);
                logout();
            }
            
        }
    };

    //TODO: проверка должна быть не в локальном времени!!!
    useEffect(() => {
        const intervalId = setInterval(() => {
            let now = dayjs();
            if (authStatus != AuthStatus.AUTHORIZED) return;
            if ( now.diff(dayjs(authTokenExpire), 'minute') < 2 ) refreshAccessToken();
            if ( now.diff(dayjs(refreshTokenExpire), 'minute') < 2 ) logout();
          }, 1000 * 5) // in milliseconds
          return () => clearInterval(intervalId)
    }, []);

    useEffect(() => {
        let userInfo_temp           = localStorage.getItem('userInfo'); 
        let authToken_temp          = localStorage.getItem('authToken'); 
        let authTokenExpire_temp    = localStorage.getItem('authTokenExpire'); 
        let refreshToken_temp       = localStorage.getItem('refreshToken'); 
        let refreshTokenExpire_temp = localStorage.getItem('refreshTokenExpire'); 

        setUserInfo(userInfo_temp);
        setAuthToken(authToken_temp);
        setAuthTokenExpire(authTokenExpire_temp);
        setRefreshToken(refreshToken_temp);
        setRefreshTokenExpire(refreshTokenExpire_temp);

        if(authToken_temp == undefined) {
            setAuthStatus(AuthStatus.UNAUTHORIZED);
        }
    }, []);

    return (
        <authContext.Provider value={{  authStatus:     authStatus, 
                                        userInfo:       userInfo,
                                        login:          login,
                                        logout:         logout,
                                        postWithAuth:   postWithAuth,
                                        getWithAuth:    getWithAuth }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;