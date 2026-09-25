import {createContext, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});

  // 7.8.6 Also here, we can remove the "persist" & "setPersist" from "auth" context.
  // const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) ?? false);

  // 7.8.7 Then, we also shall remove them from those what we're passing into context provider here. As we're no longer needing to do that, we're just always pulling it from local storage with either "useToggle" hook or just directly with local storage.
  // (Go to [src/components/Login.js])
  return (
    // <AuthContext.Provider value={{auth, setAuth, persist, setPersist}}>
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;