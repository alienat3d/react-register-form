import {createContext, useState} from "react";

// 3.7.0 Okay, time to add global state to our project and for that we've created a "context" folder and this file. We'll create a context "AuthContext" with a special React "createContext" method with an empty object inside of it.
const AuthContext = createContext({});

// 3.7.1 Then we'll create & export "AuthProvider" and then we assign it to an arrow function with destructured "children" in it as parameter. This "children" parameter is actually represents the components, that are nested inside the AuthProvider component.
export const AuthProvider = ({children}) => {
  // 3.7.2 And inside of it we'll create state "auth".
  const [auth, setAuth] = useState({});

  // ? 6.6.0 After running a couple of tests, we can confirm that the system works as expected. However, there is another security issue to discuss: although we now have a button that allows users to log out manually, what if they forget to do so? For example, imagine a user is on vacation and using a public PC in a hotel lobby. They log in and forget to log out. In our situation, the refresh token is valid for an entire day, so anyone else who visits the site will be logged in under that user's account. This is not good. We should foresee this possibility and add a "Trust this device" checkbox. If a user is not using their own device, they can leave it unchecked, which will prevent persistent login. However, if the user is logging in from their smartphone or home PC, they can check the box and stay logged in all day as long as the refresh token has not expired.
  // 6.6.1 Let's start with adding a new state to our global auth state, which we'll call "persist". And as initial value we'll use "JSON.parse" method to transform string to boolean and input inside the value from localStorage to find out whether we trust this device or not. And that's just fine to store such things in localStorage. We also need a fallback here in case if it's not exists. ↓
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) ?? false);

  // 3.7.3 And then we're returning here AuthContext.Provider here that has as value the state "auth" and it's function "setAuth" as well. And nested inside of it we'll put "children" which will be other components.
  // (Go to [src/index.js])
  // 6.6.2 Inside the Context Provider we also need to add that "persist" state and its update function "setPersist", so those will be available to other components in this app.
  // (Go to [src/components/PersistLogin.js])
  return (
    <AuthContext.Provider value={{auth, setAuth, persist, setPersist}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;