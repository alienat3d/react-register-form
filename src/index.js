import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {AuthProvider} from "./context/AuthProvider";

// ? 4.0.0 React Router from ver. 6 will let us create protected routes with role-based user permissions. That's how it works: User Kevin has only "User" role, therefore he doesn't have the permissions that "Editor" or "Admin" roles have. So, he can log in and see the homepage and other pages those users with the "User" role allowed to view, but he can't access the pages or functionality for the "Editor" or "Admin" roles.
// 4.0.1 To start with implementing React Router 6 we'll need to install it first `npm i react-router-dom@6` and then import a couple of things here to use that library. ↓
import {BrowserRouter, Routes, Route} from "react-router-dom";

// 3.7.4 Now here, we'll be wrapping the main "App" component with the global state "AuthProvider" component, that we've just created.
// (Go to [src/Login.js])
ReactDOM.render(
  <React.StrictMode>
    {/* 4.0.2 Then we'll insert the BrowserRouter wrapper here before our global auth state React context "AuthProvider" component. */}
    <BrowserRouter>
      <AuthProvider>
        {/* 4.0.3 After that, inside the global state we'll add "Routes" that shall wrap the "App" component. */}
        <Routes>
          {/* 4.0.4 But actually we don't use App component here anymore, as we'll use the "Route" component where we insert "App" component as the value of its "element" prop. Also, it'll have "path" prop with the "/*" value as it'll have other routes nested inside of it. */}
          {/*<App/>*/}
          {/* (Go to [src/App.js]) */}
          <Route path="/*" element={<App/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
);