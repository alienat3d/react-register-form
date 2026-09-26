import {useRef, useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
// import useLocalStorage from "../hooks/useLocalStorage";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

const LOGIN_URL = "/auth";

const Login = () => {
  // 7.8.1 Earlier we've been storing "persist" & "setPersist" in the context state and then pulling them in through "useAuth". Well, we no longer need to do that. ↓
  // const {setAuth, persist, setPersist} = useAuth();
  const {setAuth} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const usernameRef = useRef(null);
  const errorRef = useRef(null);

  // 7.2 Next, we'll implement the custom hook in the Login component and assign it to the username input. We'll find the line where we define the state for the username input and replace "useState" with our custom hook. The first argument will be the key for localStorage, "user", and the second argument will be an empty string. Now, if the user types their username into the username input, it will also be saved in their local storage. When they go somewhere else and come back, their username will still be there.
  // (Go to [src/hooks/useLocalStorage.js])
  // const [username, setUsername] = useState("alienat3d");
  // const [username, setUsername] = useLocalStorage("user", "");
  // 7.5.0 Let's apply that to the "username" state again but using the "useInput" custom hook this time and this will be looked different now, as "initValue" we'll have an empty string and instead of "setUsername" we'll use "resetUsername", also we extract "usernameAttributes" too. ↓
  // 7.6.1 Now, we're not just passing a value, but we'll be passing the "key" and then, as the second argument it'll be an empty string there.
  // (Go to [src/hooks/useToggle.js])
  const [username, resetUsername, usernameAttributes] = useInput("username", "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // 7.8.0 Let's extract here the "isChecked" state and "toggleCheck" from the "useToggle" hook which we've just created. And inside of that hook we'll give it a key and also set the initial value to false (in case if there is no value for "persist" key in local storage yet). ↑
  const [isChecked, toggleCheck] = useToggle("persist", false);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({user: username, pwd: password}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      });
      const accessToken = response?.data?.accessToken;
      // 8.3.1 We don't need to grab the roles any longer here that we were defining.
      // (Go to [src/components/RequireAuth.js])
      // const roles = response?.data?.roles;

      // ? 8.1.0 A second-best practice is just to ask yourself a question: "Does the data really need to be stored in state or we putting things in there that we don't need?" Let's look at an example of this here in the "Login" comp. Notice, when we're getting the information back here in the "handleSubmit" func we're putting the "username", "password", "roles" and "accessToken" in the state, but do we really need all of those in the state? Well, the answer here: "Yes and no." Look at our "setAuth" func that we're holding in context, because we don't need all of that.
      // ? 8.1.2 But the "auth" state holds that data for a long time in React context, and maybe we don't need to have "password" there, as we probably won't use it again. So, no reason to put that in there. The need of "roles" in there is also disputable, but let's come back to that later. What we do need is "accessToken" and the "username" is fairly handy too and isn't something we're guarding, especially if it's something like the username that we might print to the actual public facing web page as well, we're not trying to hide that.
      // (Go to [src/components/Users.js])
      // 8.3.0 So, let's back to this part of "Login" comp. and let's ask ourselves if we really need those roles to be stored in "auth" state? The answer is "No" and that's because we're also sending those roles in the access token. We were doing that already so there's no real need to send those roles in addition to sending them in the access token, and we don't need to double up. There is also no reason to show those roles — you might as well hide them at least inside the token. ↑
      // setAuth({username, password, roles, accessToken});
      setAuth({username, accessToken});

      // 7.5.1 Next, we'll find the occurrences, where we were using "setUsername" and replace them with "resetUsername" function.
      // setUsername("");
      resetUsername();

      // ? 8.1.1 But as far as putting a "password" in state here maybe temporarily just because it's a controlled form, so we have "useState" there above for "password" state & "setPassword" func. That makes sense, but as soon as we submit that password we empty that state out. So, it's only there while the user is actually using the form. ↑
      setPassword("");

      navigate(from, {replace: true});
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login Failed");
      }

      errorRef.current.focus();
    }
  };

  // 7.8.2 And there are a couple other things we were doing in the form that we'll no longer need to do because we're taking care of them inside the "useToggle" hook: "togglePersist" function and "useEffect" that sets the value for "persist" key as well. So, let's just get rid of them. ↓
  // const togglePersist = () => setPersist(prev => !prev);

  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setErrorMessage(""), [username, password]);
  // useEffect(() => localStorage.setItem("persist", persist), [persist]);

  return (
    <section>
      <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"}
         aria-live="assertive">{errorMessage}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        {/* 7.5.2 We still have to change this one as well, as we're using the "usernameAttributes" object now. So, we'll just spread it out here in the attributes of this input. And that applies the "value" and the "onChange" by doing that. */}
        {/* (Go to [src/hooks/useInput.js]) */}
        {/*<input ref={usernameRef} onChange={(evt) => setUsername(evt.target.value)} value={username} id="username" type="text" autoComplete="off" required/>*/}
        <input ref={usernameRef} id="username" type="text" autoComplete="off" {...usernameAttributes} required/>
        <label htmlFor="password">Password:</label>
        <input id="password" onChange={(evt) => setPassword(evt.target.value)} value={password} type="password"
               required/>
        <button type="submit">Sign In</button>
        <div className="checkbox-wrapper">
          <label htmlFor="persist">
            {/* 7.8.3 Also inside the JSX there is some things to fix: we'll replace calling "togglePersist" with "toggleCheck" and the value for "checked" attribute will be bind with "isChecked" state. */}
            {/*(Go to [src/components/PersistLogin.js])*/}
            {/*<input onChange={togglePersist} id="persist" className="input" type="checkbox"/>*/}
            <input onChange={toggleCheck} id="persist" className="input" type="checkbox" checked={isChecked}/>
            <span className="checkbox"></span>
          </label>
          <label htmlFor="persist" className="label">Trust This Device</label>
        </div>
      </form>
      <p>
        Forgot Password?<br/>
        <span className="line">
          <Link to="/">Remind Me!</Link>
        </span>
      </p>
      <p>
        Don't Have an Account?<br/>
        <span className="line">
          <Link to="/register">Sign Up!</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;