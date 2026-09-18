// 3.0 Here we'll create a component for a login page which is pretty similar to the Register component. So, we'll need to import a couple of React hooks that we would use here.
// 3.7.5 Let's add the AuthContext here as well as the "useContext" hook. And this will be the global state for our app.
// 4.2.2.1 And we can see how this practically works inside the "Login" component. We don't need "useContext" hook & "AuthContext" context here no more, as we've created the "useAuth" custom hook for that. ↓
// import {useRef, useState, useEffect, useContext} from "react";
// import AuthContext from "../context/AuthProvider";
import {useRef, useState, useEffect} from "react";
import useAuth from "../hooks/useAuth";
// 4.5.0 Let's add some changes to "Login" comp., so once the user logged in it can take him to where he was headed and of course it will remember where he came from. For that we'll need to import three things from "React Router" here. ↓
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "../api/axios";

// 3.8.0 Now, if we successfully authenticate when we log in we will set our new auth state and store it in the global context. We'll add "axios" library here into this component and set the endpoint for authorization here. ↓
const LOGIN_URL = "/auth";

const Login = () => {
  // 3.7.6 So, now we can pull in what we need for our Login component here and that is the "setAuth".
  // 4.2.3 Then, instead of "useContext" here we'll use our custom hook "useAuth" that'll do the same thing.
  // const {setAuth} = useContext(AuthContext);
  // (Go to [src/components/RequireAuth.js])
  const {setAuth} = useAuth();

  // 4.5.1 Then, right after calling the "useAuth" hook we'll define "navigate" with "useNavigate" and location with "useLocation" hooks.
  const navigate = useNavigate();
  const location = useLocation();

  // 4.5.2 Here we'll define "from" and we'll say that either location should have the path in the "pathname" if it exists, or it should bring user to the homepage otherwise. ↓
  const from = location.state?.from?.pathname || "/";

  // 3.1 Then we're going to add a couple of refs. The "usernameRef" we'll need to set the focus on that first input when the component loads. And the "errorRef" for setting focus on errors, especially for a screen reader to read if an error occurs.
  const usernameRef = useRef(null);
  const errorRef = useRef(null);

  // 3.2 We also need four pieces of state here. The "username" and the "password" we'll need for the inputs and "errorMessage" corresponds for an error we might get back when user tries to authenticate. The last "success" state is temporary just for this tutorial really to let us show a success message (in the future as wie tie all of this together we would replace that and navigate with React Router to a page of our choice after successful login).
  const [username, setUsername] = useState("KetiO");
  const [password, setPassword] = useState("LaLaLand86");
  const [errorMessage, setErrorMessage] = useState("");
  // 4.5.4 We also can get rid of this "success" state, as we replaced it now with the "navigate" function. ↓
  // const [success, setSuccess] = useState(false);

  // 3.5.1 This function supposed to be asynchronous and will receive the event, and as first we'll do "preventEvent" to stop refreshing the page after clicking the form submit button (as it's the default action for that event). As you might notice, we don't have to pass in the event to the "handleSubmit" function — it receives by default.
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // ? 3.5.2 Now, this is the place where we normally integrate "axios" and some global state for the authorization where we store our database with the users credentials in it.
    // 3.5.3 But we can do that later, and now we're just focused on creating form with React. So, we could just put a flag "success" in here for now to show that form is actually works.
    // console.log(`The username "${username}" is just signed in with the password "${password}".`);

    // 3.8.1 Now, we're ready to complete the "handleSubmit" function with a real authentication and testing it with backend. And, of course, as we're handling the server request we'll use "try...catch" construction to be able to catch some errors those might occur. Then we'll be trying to send request to the server API with axios method "post" and inside we're pass in "LOGIN_URL" which will attach itself to the base URL that we've already defined in [src/api/axios.js] file. The second parameter here will be "JSON.stringify" method, where we pass in values from "username" & "password" states (that's the payload that our RestAPI is expecting to receive to authenticate a user: "user" & "pwd" is how the fields are named at our RestAPI, that's why we're writing it like that also here).
    // 3.8.2 As the third parameter we'll set up some options for the request such as headers for JSON data type and also to not forget "withCredentials" set to true.
    // ? 3.8.3 Now, what is great about using "axios" lib is it will throw an error if there's an error, and we don't have to check here, like we do with fetch to see if the response was okay and likewise we also don't have to response and convert it to JSON — "axios" will take care about that for us.
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({user: username, pwd: password}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      });
      // console.log(username);
      // console.log(password);
      // 3.8.4 And you might want to check if everything went well and see the data in the console for the test, so let's stringify the response and the data will be in the "data" property then.
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));

      // 3.8.5 What is also interesting to get from the backend is the access token that we want to store it with the other user information.
      const accessToken = response?.data?.accessToken;

      // 3.8.6 And then we also get the roles that we're sending with the data in our RestAPI.
      const roles = response?.data?.roles;

      // 3.8.7 Now, after we have this extra information we'll call "setAuth" and store all of that at global store auth object.
      setAuth({username, password, roles, accessToken});

      // 3.5.4 And right after signing in we can clear both inputs with setting tied to them states to an empty string. ↓
      setUsername("");
      setPassword("");

      // 4.5.3 And after the form is cleared out then we want to navigate away, so instead of just setting "success" state, that we have for testing purposes to true we'll call "navigate" function, where we pass in the path from "from" variable and also options object, where we set "replace" property to true. ↑
      // setSuccess(true);
      navigate(from, {replace: true});
    } catch (err) {
      // 3.8.8 Okay, but we also need to handle the errors we might receive. Let's check if there is no response, but we've got and error, so we'll set the errorMessage to "No Server Response".
      if (!err?.response) {
        setErrorMessage("No Server Response");
        // 3.8.9 After that we can check if there is a response, but the status code of it is 400 (which means "the information that was expected wasn't received") then we'll set an error message to "Missing Username or Password".
      } else if (err.response?.status === 400) {
        setErrorMessage("Missing Username or Password");

        // 3.8.10 Next case will be with the status code of 401 was returned (which means "unauthorized").
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized");

        // 3.8.11 And for the rest cases we'll just set an error to "Login Failed").
      } else {
        setErrorMessage("Login Failed");
      }

      // ? 3.8.12 Of course, there can be other error codes & messages, just depending on what kind of API we're working with and what is expected to get back.
      // 3.8.13 Yet, we still have to set the focus on that error display so a screen reader can read that information. That's where we had that aria live attribute, and we set it to "assertive", so it announced immediately.
      errorRef.current.focus();
    }
  };

// ? 3.9 Okay, after all that been done, let's test it out with our RestAPI, that we've created at another Dave Gray's "Node.js Course for Beginners". So, we'll up in running the server from there and test our form if we can sign in with that and all the different scenarios and see what will happen.
// (Go to [src/index.js])

// 3.3.0 We're going to apply "useEffect" hook twice. First, to set the focus on that first input when the component loads ("[]" as dependency points on that).
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

// 3.3.1 Second time we'll use "useEffect" to empty out any error message that we might have if the user changes the user state or the password state.
  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

// 3.4.0 So, time to add some JSX-code here and create the Login Form. We'll start with the error message display, which will be inside of paragraph HTML-element at the top of the section. Note that it has also an "aria-live='assertive'" attribute, which force the screen readers to announce it immediately, when the focus is set on this element and that's also why we have "errorRef" on it, so we can set the focus there.
// 3.6 Let's also add something in our JSX here that will respond to that "success" flag, when it changed.
// (Go to [src/context/AuthProvider.js])
  return (
    // 4.5.5 And we also can remove that fragment from here as well.
    // (Go to [src/components/RequireAuth.js])
    /*<> {success ? (
      <section className="nav-window">
        <h1 className="message">You are logged in!</h1>
        <Link className="btn" to="/">Home</Link>
      </section>
    ) : (*/
    <section>
      <p ref={errorRef} className={errorMessage ? "errmsg" : "offscreen"}
         aria-live="assertive">{errorMessage}</p>
      <h1>Sign In</h1>
      {/* 3.4.1 Next, we'll create a form for signing in with two inputs in it and a submit button to send the data. To tie the inputs to the states we'll use the anonymous functions with "onChange" event listener. Also, to make these inputs "controlled" we'll put the state names to it's "value" attribute. And this is important, when we want to clear this form nad we definitely want to clear a sign-in form. */}
      {/* 3.5.0 We also need to add the "submit" event listener to the form and the function that will handle it. */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input ref={usernameRef} onChange={(evt) => setUsername(evt.target.value)} value={username} id="username"
               type="text" autoComplete="off" required/>
        <label htmlFor="password">Password:</label>
        <input id="password" onChange={(evt) => setPassword(evt.target.value)} value={password} type="password"
               required/>
        {/* 3.4.2 We don't really need an event listener on this button, as it's the only button the that form, so when it's clicked it will trigger the "submit" event, so we will want to handle that "submit" event with the form. ↑ */}
        <button type="submit">Sign In</button>
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
    /*    )}
        </>*/
  );
};

export default Login;