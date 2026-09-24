import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
  const {auth} = useAuth();

  // ? 5.0.0 Today, we're going to examine React login authentication with JWT access and refresh tokens. When the user logs in, we'll display the global state in the console. We'll see "username", "password", "roles", and "accessToken". We also receive a refresh token, but it's neither stored in local storage nor in the auth state. JavaScript can't access it. However, when needed, "axios" will send it back to the server when the user requests data. Now, let's see how all of this works in React. We'll learn how to properly handle access and refresh tokens in the client, which means the front-end code that runs in the browser.
  // ? 5.0.1 But before we start to code it can be useful to refresh the knowledge about what "JWT" is about, and it's being used for.
  // (Go to [src/components/Users.js])

  const location = useLocation();

  return (
    auth?.roles?.find(role => allowedRoles?.includes(role)) ?
      <Outlet/> :
      auth?.username ?
        <Navigate to="/unauthorized" state={{from: location}} replace/> :
        <Navigate to="/login" state={{from: location}} replace/>
  );
};

export default RequireAuth;