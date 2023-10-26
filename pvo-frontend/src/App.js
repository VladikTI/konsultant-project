import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AuthStore from "./store.js";
import UserPrivateWrapper from "./userPrivateWrapper.jsx";

import LoginPage from "./routes/login.jsx";
import UsersPage from "./routes/usersPage";
import AdminPage from "./routes/admin";
import EditingPage from "./routes/editing";
import Apply from "./routes/apply.jsx";

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
          <Route element={<UserPrivateWrapper  />}>
            <Route path="/apply" element={<Apply/>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/editing" element={<EditingPage />} />
          </Route>

          <Route path="*" element={<div>404... not found </div>} />
          
        </Routes>
      </BrowserRouter>
  );
});

export default App;