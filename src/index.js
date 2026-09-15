import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {AuthProvider} from "./context/AuthProvider";

// 3.7.4 Now here, we'll be wrapping the main "App" component with the global state "AuthProvider" component, that we've just created.
// (Go to [src/Login.js])
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App/>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);