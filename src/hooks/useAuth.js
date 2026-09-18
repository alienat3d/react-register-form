import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

// 4.2.1 Here we'll need to import the "useContext" hook from React as well as the "authContext" that we've created before at "AuthProvider". And then we'll define the custom hook "useAuth".
// ? 4.2.2.0 Usually when we'd use "useAuth" or use this context in any component as we'll see in the login component we would have to import "useContext" & "AuthContext". Then, set our context equal to this "useContext(AuthContext)". So, we'd rather create this simple custom hook to eliminate those repetitive steps by just defining this custom hook, so we can in future just use "useAuth" and pull what we need from the "AuthContext" context.
// (Go to [src/components/Login.js])
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;