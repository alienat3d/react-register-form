import {useRef, useState, useEffect} from "react";
import useAuth from "../hooks/useAuth";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "../api/axios";

const LOGIN_URL = "/auth";

const Login = () => {
  // 6.6.5 Let's bring in also "persist" & "setPersist" here. ↓
  const {setAuth, persist, setPersist} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const usernameRef = useRef(null);
  const errorRef = useRef(null);
  const [username, setUsername] = useState("alienat3d");
  const [password, setPassword] = useState("iMdABossH3r3!");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({user: username, pwd: password}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuth({username, password, roles, accessToken});

      setUsername("");
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

  // 6.6.7 Next, we'll create the "togglePersist" simple function, where we just update the "persist" state with the opposite value, that was before in it. ↓
  const togglePersist = () => setPersist(prev => !prev);

  useEffect(() => usernameRef.current.focus(), []);
  useEffect(() => setErrorMessage(""), [username, password]);

  // 6.6.8 And we'll add also "useEffect" hook that will listen for the "persist" state changes and then store that value from it in localStorage.
  // (Go to [src/components/PersistLogin.js])
  useEffect(() => localStorage.setItem("persist", persist), [persist]);

  return (
    <section>
      <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"}
         aria-live="assertive">{errorMessage}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input ref={usernameRef} onChange={(evt) => setUsername(evt.target.value)} value={username} id="username"
               type="text" autoComplete="off" required/>
        <label htmlFor="password">Password:</label>
        <input id="password" onChange={(evt) => setPassword(evt.target.value)} value={password} type="password"
               required/>
        <button type="submit">Sign In</button>
        {/* 6.6.6 Let's add the input of "checkbox" type here underneath the "Sign In" button, where for "onChange" event listener we want to set the "togglePersist" function that we'll create above and the attribute "checked" should be set to a value from the "persist" state. ↑ */}
        <div className="checkbox-wrapper">
          <label htmlFor="persist">
            <input onChange={togglePersist} id="persist" className="input" type="checkbox"/>
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