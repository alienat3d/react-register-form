import {Navigate, Outlet, useLocation} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
  const {auth} = useAuth();

  // ? 5.0.0 Today, we're going to examine React login authentication with JWT access and refresh tokens. When the user logs in, we'll display the global state in the console. We'll see "username", "password", "roles", and "accessToken". We also receive a refresh token, but it's neither stored in local storage nor in the auth state. JavaScript can't access it. However, when needed, "axios" will send it back to the server when the user requests data. Now, let's see how all of this works in React. We'll learn how to properly handle access and refresh tokens in the client, which means the front-end code that runs in the browser.
  // ? 5.0.1 But before we start to code it can be useful to refresh the knowledge about what "JWT" is about, and it's being used for.
  // (Go to [src/components/Users.js])

  const location = useLocation();

  // 8.3.3 And then we'll import that library and use it here. We'll use an optional chaining to see if "accessToken" exists in "auth" state and if it is then we'll pass that accessToken into "jwtDecode" method from the same name library.
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;

  // 8.3.4 Next, we'll define the user roles because that's what we were using before. So, we'll use optional chaining again and say if "decoded" has "UserInfo" object then get the roles from that or if it doesn't exist let it be just an empty array. ↓
  const roles = decoded?.UserInfo?.roles || [];

  // 8.3.2 So, let's change here, how "RequireAuth" handles the roles. But first we need to install "jwt-decode" package (https://www.npmjs.com/package/jwt-decode) for that, what we're up to. ↑
  // 8.3.5 Then, we'll just fix a little how we're rendering users list here, because now we'll just use "find" method to "roles" array, that we've got from decoded from a JWT-token "UserInfo" object. ↓
  return (
    // auth?.roles?.find(role => allowedRoles?.includes(role)) ?
    roles.find(role => allowedRoles?.includes(role)) ?
      <Outlet/> :
      auth?.username ?
        <Navigate to="/unauthorized" state={{from: location}} replace/> :
        <Navigate to="/login" state={{from: location}} replace/>
  );
};

export default RequireAuth;

// ? 8.4 Another "best practice" before we finish this tutorial is about "Redux Toolkit" and if you're using it in your project you might want to disable the "Redux Dev Tools" as well. To do that simply add to your "store.js", where you wrote "configureStore" function, add "devTools: false" inside of it.