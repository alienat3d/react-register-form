// 4.3.0 Then, we'll create a new component to protect our routes. To do so, we'll need to import a few things from the React Router library, such as useLocation, Navigate, and Outlet. We'll also need our custom "useAuth" hook here.
import {Navigate, Outlet, useLocation} from "react-router-dom";
import useAuth from "../hooks/useAuth";


// 4.6.0 Ok, time to add roles-based permissions to our routes-protection here. Now, this "RequireAuth" component will receive a prop, and it's name will be "allowedRoles".
const RequireAuth = ({allowedRoles}) => {
  const {auth} = useAuth();

  // 4.3.1 Let's look at two ways we can define the RequireAuth component. The first version is simpler and more like a boolean, basically saying whether the user is logged in. Later, we'll change it to a more advanced version that supports role-based permissions for users.
  // 4.3.2 First, we'll grab the state "auth" from the global state with "useAuth". Second, we'll need the location that we'll get from hook "useLocation"
  const location = useLocation();

  // 4.3.3 Then, we'll return a ternary statement that checks if "auth" has a "username". If so, we'll return the "Outlet" component, which, as you probably remember, represents any of the child components of "RequireAuth". This allows the "RequireAuth" component to protect all the child components nested inside it.
  // 4.3.4 If the "auth" doesn't have a "user", we'll want to navigate the user to the login page using the "Navigate" that we imported from "React Router". We'll also add a few attributes, such as "replace". This is because the user didn't ask to be sent to the login page. He wanted to go to another page, but we found out that he wasn't logged in. Therefore, we sent him to the login page and replaced the address in the address field with "/login". We'll also add "state={{from:location}}" so the user can still go back to the page he was redirected from.
  // (Go to [src/App.js])
  /* return (
    auth?.username ? <Outlet/> : <Navigate to="/login" state={{from: location}} replace/>
  ); */
  // 4.6.1 Since we receive "allowedRoles" instead of a user, we're going to check the "roles" stored in our state. Then, we'll use the "find" method, passing in each role to see if it matches. Next, we'll check "allowedRoles" to see if a role is passed with the "includes" method. Basically, we're comparing two arrays: "roles," which is stored in our global state, and "allowedRoles," which is passed into this component. We're trying to match up a value until we find one.
  // 4.6.2 But what we also need here is to show an unauthorized page because there's a chance a user will be logged in but not authorized to see the requested path or page. If we show the "Outlet" component for the truthy outcome, that's fine. But then let's add a chained ternary. We'll check if our global state "auth" has "username". If so, we'll know that the user isn't allowed to see what's nested as "Outlet", and we'll need to use another "Navigate" with the path to the "Unauthorized" page.
  // (Go to [src/App.js])
  return (
    auth?.roles?.find(role => allowedRoles?.includes(role)) ?
      <Outlet/> :
      auth?.username ?
        <Navigate to="/unauthorized" state={{from: location}} replace/> :
        <Navigate to="/login" state={{from: location}} replace/>
  );
};

export default RequireAuth;