import { Navigate, Outlet, Route } from "react-router-dom";
import authStore from "./store.js";
import { observer } from "mobx-react-lite";

const UserPrivateWrapper = (props) => {

    if (authStore.isLoadingAuth) {
        return <div>Checking auth...</div>;
    }
    if (authStore.isAuth) {
        return <Outlet/>
    } else {
        return <Navigate to="/login" />;
    }
};

export default observer(UserPrivateWrapper);