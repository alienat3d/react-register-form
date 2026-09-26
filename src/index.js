import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {AuthProvider} from "./context/AuthProvider";

// ? 4.0.0 React Router from ver. 6 will let us create protected routes with role-based user permissions. That's how it works: User Kevin has only "User" role, therefore he doesn't have the permissions that "Editor" or "Admin" roles have. So, he can log in and see the homepage and other pages those users with the "User" role allowed to view, but he can't access the pages or functionality for the "Editor" or "Admin" roles.
// 4.0.1 To start with implementing React Router 6 we'll need to install it first `npm i react-router-dom@6` and then import a couple of things here to use that library. ↓
import {BrowserRouter, Routes, Route} from "react-router-dom";

// ? 8.0.0 In this React Login Form App we stored all login auth data in state and I logged it to the console so we could see what was happening, but that's only for tutorial you won't do that in production really. And even without logging to the console we could open up React Dev Tools and see all the state data values. And in this tutorial let's look at some simple best practices to keep login data more secure including how to disable React Dev Tools.
// ? 8.0.1 So, if we open the Dev Tools in Chrome browser for example and find the tab "React Components" in there, then we'll find "AuthProvider" component and click on it, and at it's "state" we'll see all the credentials for that logged user. And let's talk about how can we disable React Dev Tools when we're in production for our app. Now, while it's possible to write your own code to do this, there is a good solution (https://www.npmjs.com/package/@fvilers/disable-react-devtools) published that you can actually use. And we have to use it here in the "index.js" file, as it's written in description to that lib, we just need to install, import it and then run "disableReactDevTools" func. And that's it, in a production our app won't show anything at React Dev Tools plugin.
// (Go to [src/components/Login.js])
import {disableReactDevTools} from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

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