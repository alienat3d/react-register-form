// 3.0 Here we'll create a component for a login page which is pretty similar to the Register component. So, we'll need to import a couple of React hooks that we would use here.
import {useRef, useState, useEffect} from "react";

const Login = () => {
// 3.1 Then we're going to add a couple of refs. The "usernameRef" we'll need to set the focus on that first input when the component loads. And the "errorRef" for setting focus on errors, especially for a screen reader to read if an error occurs.
  const usernameRef = useRef(null);
  const errorRef = useRef(null);

// 3.2 We also need four pieces of state here. The "username" and the "password" we'll need for the inputs and "errorMessage" corresponds for an error we might get back when user tries to authenticate. The last "success" state is temporary just for this tutorial really to let us show a success message (in the future as wie tie all of this together we would replace that and navigate with React Router to a page of our choice after successful login).
  const [username, setUsername] = useState("zaplin");
  const [password, setPassword] = useState("admin123");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // 3.5.1 This function supposed to be asynchronous and will receive the event, and as first we'll do "preventEvent" to stop refreshing the page after clicking the form submit button (as it's the default action for that event). As you might notice, we don't have to pass in the event to the "handleSubmit" function — it receives by default.
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // ? 3.5.2 Now, this is the place where we normally integrate "axios" and some global state for the authorization where we store our database with the users credentials in it.
    // 3.5.3 But we can do that later, and now we're just focused on creating form with React. So, we could just put a flag "success" in here for now to show that form is actually works.
    console.log(`The username "${username}" is just signed in with the password "${password}".`);

    // 3.5.4 And right after signing in we can clear both inputs with setting tied to them states to an empty string. ↓
    setUsername("");
    setPassword("");

    setSuccess(true);
  };

// 3.3.0 We're going to apply "useEffect" hook twice. First, to set the focus on that first input when the component loads ("[]" as dependency points on that).
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

// 3.3.1 Second time we'll use "useEffect" to empty out any error message that we might have if the user changes the user state or the password state.
  useEffect(() => {
    setErrorMessage('');
  }, [username, password]);

// 3.4.0 So, time to add some JSX-code here and create the Login Form. We'll start with the error message display, which will be inside of paragraph HTML-element at the top of the section. Note that it has also an "aria-live='assertive'" attribute, which force the screen readers to announce it immediately, when the focus is set on this element and that's also why we have "errorRef" on it, so we can set the focus there.
// 3.6.0 Let's also add something in our JSX here that will respond to that "success" flag, when it changed.
  return (
    <> {success ? (
      <section>
        <h1>You are logged in!</h1>
        <br/>
        <p><a href="#">Go to Home</a></p>
      </section>
    ) : (
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
          <button type="sumbit">Sign In</button>
        </form>
        <p>
          Forgot Password?<br/>
          <span className="line">
          {/*put router link here*/}
            <a href="#">Remind Me!</a>
        </span>
        </p>
        <p>
          Don't Have an Account?<br/>
          <span className="line">
          {/*put router link here*/}
            <a href="#">Sign Up!</a>
        </span>
        </p>
      </section>
    )}
    </>
  );
};

export default Login;