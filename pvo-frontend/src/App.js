import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AuthStore from "./store.js";
import PrivateRoute from "./privateRoute.js";

import LoginPage from "./routes/login";
import UsersPage from "./routes/usersPage";

const App = observer(() => {

  useEffect(() => {
    AuthStore.checkAuth();
  }, []);

  return (
      <BrowserRouter>
        <Routes>
          //страница, для посещения которой авторизация не требуется
          <Route path="/login" element={<LoginPage />} />

          //страницы, для посещения которых требуется авторизация
          <Route path="/users" element={<PrivateRoute  />}>
            <Route path="" element={<UsersPage />} />
            <Route path=":id" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<div>404... not found </div>} />
        </Routes>
      </BrowserRouter>
  );
});

export default App;
