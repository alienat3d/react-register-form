import {createContext, useState} from "react";

// 3.7.0 Okay, time to add global state to our project and for that we've created a "context" folder and this file. We'll create a context "AuthContext" with a special React "createContext" method with an empty object inside of it.
const AuthContext = createContext({});

// 3.7.1 Then we'll create & export "AuthProvider" and then we assign it to an arrow function with destructured "children" in it as parameter. This "children" parameter is actually represents the components, that are nested inside the AuthProvider component.
export const AuthProvider = ({children}) => {
  // 3.7.2 And inside of it we'll create state "auth".
  const [auth, setAuth] = useState({});

  // 3.7.3 And then we're returning here AuthContext.Provider here that has as value the state "auth" and it's function "setAuth" as well. And nested inside of it we'll put "children" which will be other components.
  // (Go to [src/index.js])
  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;