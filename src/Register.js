import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

// 1.0.0 Okay, we'll start by creating the 'Register' component for our registration form by copying a couple of regular expressions: one to validate usernames and another to validate passwords. That's what we will be validating the user input with in form fields.
// 1.0.1 Username regex says it must start with a lower or uppercase letter. After that it must be followed by anywhere from 3 to 23 characters that can be a lower or uppercase letters, digits, hyphens or underscores. So overall it must be 4 to 24 characters.
// 1.0.2 Now for the password RegEx it requires at least one lower case letter, one uppercase letter, one digit and one special character, and it can be anywhere from 8 to 24 characters.
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// 2.1.1 The best to do that as extra variable, so that we can find it faster if it shall change. ↓
const REGISTER_URL = "/register";

const Register = () => {
  // 1.1 Let's start creating the Register component logic with putting in two ref-references: 1) for the user inputs ("userRef"), which allow us to set the focus on the user input when component loads, 2) for an error reference ("errRef"), because if we get an error, we need to put the focus on that, so it can be announced by a screen reader for accessibility.
  const userRef = useRef(null);
  const errRef = useRef(null);

  // 1.2.0 Then we'll create a states for the user field. There will be three of them: 1) "user" state will be tied to the username input, we also got "setUser" function here to save\change the state; 2) "validName" state is boolean and will be an indicator for whether the typed in username validates or not; 3) "userFocus" state is also boolean and is an indicator for whether we have focus on that input field or not.
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  // 1.2.1 Let's add also the similar to those three about state-packs for other two input fields "validPwd" & "matchPwd" for password and matching password input fields.
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // 1.2.2 In addition to all that we'll add a state for possible error message, if an error occurs. And also we'll add a boolean state for indicator if the submitting form succeed.
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // 1.8.1 It's going to be an asynchronous function. Inside it, we'll need to add the preventDefault event method to prevent the page from updating after the form is submitted.
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // 1.8.2 This is optional for those who want to be very cautious. It enforces our RegEx validation. 99.9% of people wouldn't do that, but if someone goes to the browser console, selects the form button, and enables it, the form will still validate with this little hack. Here we're validating in the state of "user" and "pwd" again, so if for some reason button was enabled that wasn't passing validation we're doing a double check here. If the username or password is invalid, we'll return from that function without saving any data.
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    // console.log(user, pwd);
    // 1.8.3 Then, if all correct, we'll set success state to true, so we can inform our user, that his account created successfully. ↓
    // setSuccess(true);
    // 2.1.0 Now to use "axios" here to communicate with a local server driven by "JSON-server" library let's use "try...catch", where in "try" block of it we'll define "response" that we should get from "axios". We'll use here "await" as it's asynchronous function as we said above. And we'll use axios's method "post" to save a new user in DB. Inside of that "post" method we'll set a register URL. ↑
    // 2.1.2 So we'll use that REGISTER_URL inside of that method as first argument and the second will be the data we want to save on server (a payload). And inside of this we'll destructure two properties for username ("user") and password ("pwd") as it's what server expect to get from a client. Now there is a third parameter now needs to be added to post, which is an object with HTTP-request "POST" settings, where we need to specify headers.
    // ? 2.1.3 One of the advantages of using "axios" is that we don't need manually change the response to JSON, it already happens.
    // 2.1.4 It's also a place where we want to set "success" state to true and optionally to clear input fields as well.
    // 2.1.5 In a "catch" block we can use different logic, but here we'll use optional chaining to check if err.response has at all, maybe we've lost internet connection, so we'll set "errMsg" state to "No Server Response" then. Next after that we'll check the status and if it has value of 409, that would mean the username we've tried to submit is already taken, so we'll set "errMsg" to "Username Taken". For the rest cases we'll just set "Registration Failed".
    try {
      const response = await axios.post(REGISTER_URL, JSON.stringify({user, pwd}), {
        headers: {"Content-Type": "application/json"},
        withCredentials: true
      });
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      // clear input fields if it needs
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      // 2.1.6 Finally we want to set the focus on that error field for screen readers.
      errRef.current.focus();
    }
  };

  // 1.3.0 Here we'll apply the "useEffect" hook to set the focus on the username input field for the first time the component loads. Notice there is nothing in the dependencies array.
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // 1.3.1 Next "useEffect" is going to be applied to the username and this is where we validate the username, so now we have here "user" as dependency for that. So everytime username changes it will run the validation of that field.
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  // 1.3.2 We'll use "useEffect" for the password too. Notice it's a little different. We'll be not only testing password input field with RegEx, but also check if two states "pwd" & "matchPwd" matches, so the two inputs for password and matchPassword matches as well. The nice thing of having both "pwd" & "matchPwd" inside the one hook is that in case one of them changes the valid match will check if the two fields are in sync.
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // 1.3.3 We'll need one more "useEffect" for the error message. If we display an error message, we naturally want it to be available. Here, in the dependencies, we'll have all three inputs, because we want to remove the error. If the user starts typing in any of the fields, it will mean that they have read the error message.
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  // 1.8.4 Let's create a React fragment. Inside it, there will be a ternary operator. If our state "success" has a value of true, then the word "Success!" will show on the page, along with a link to the login page instead of the registration form.
  // (Go to [src/api/axios.js])
  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          {/* 1.4.0 Let’s describe the key elements with React logic in our component’s layout. So, we'll have a paragraph here to display an error message if one exists. It will be tied to the reference "errRef" and dynamically replaceable CSS classes depending on the "errMsg" indicator state, which will hide or show the message on the screen. The "aria-live" attribute is set to "assertive," meaning that when focus is set on this element, it will be announced by a screen reader. This is important if an error exists. */}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h1>Register</h1>
          {/* 1.8.0 Let's add "onSubmit" event here as it's a form and we'll add "handleSubmit" function to it, that we'll create above. ↑ */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              {/* 1.4.7 Let's add here a couple of "span" elements, that have FontAwesome icons in them. They'll have classNames with ternary operators for each. One for the green checkmark if the username valid. Here we can use the "display: none;" style, as we're already using "aria-invalid" at input's attribute for the screen readers. */}
              <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"}/>
              {/* 1.4.8 Now, for red "X" icon it's a bit different, here we're checking not just for valid username, but also if "user" state exists. We won't need it if the field is empty either. ↓ */}
              <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"}/>
            </label>
            {/* 1.4.1 We'll add another ref here, which will allow us to set focus on the input. The next attribute is autoComplete which we want to set to "off", because we don't want to see previous values suggested to this field that other users may have entered as it's a registration field, and it should be a new username. "onChange" event listener will have an arrow function that will provide the event, and then we'll set the user state. So this ties the input to the "user" state. */}
            {/* ? 1.4.2 There are also two important attributes for accessibility: "aria-invalid" which will be set to "true", when the component loads, because we will not have a valid username. So, when we do have a valid username it will be set to "false". This lets a screen reader announce whether this input field needs adjusted before the form is submitted, so that definitely help accessibility. */}
            {/* ? 1.4.3 Next "aria-describedby" attribute lets us provide another element that describes the input field. */}
            {/* 1.4.4 With "onFocus" we'll simply set the "userFocus" state to true and with "onBlur" set the same state to "false". */}
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            {/* 1.4.5 ? So here we'll provide that description for "aria-describedby" attribute for previous input field. Then we'll be passing dynamically a CSS-class to show or hide the instructions to that field. It shall be shown only if "userFocus" state has "true" as its value and "user" state has some value (not empty) and it's not a valid username. */}
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
              {/* ? 1.4.6 We'll pull in one of the FontAwesome icon here as a component, where we choose which icon to use as "icon" attribute. ↑ */}
              <FontAwesomeIcon icon={faInfoCircle}/>
              4 to 24 characters.<br/>
              Must begin with a letter.<br/>
              Letters, numbers, underscores, hyphens allowed.
            </p>

            {/* 1.5.0 Now, let's take a look at the password input section. We see that the logic for displaying valid or invalid icons is exactly the same. */}
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"}/>
              <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"}/>
            </label>
            {/* 1.5.1 Since this is an input field with the type "password," the "autocomplete" attribute is unnecessary because it won't be supported for this type of input anyway. */}
            {/* 1.5.2 We also won't need attribute "ref" here, as we don't want to set focus on this field when the component loads. The rest of attributes are basically the same, as with previous username input. ↓ */}
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            {/* 1.5.3 Now let's look at this element that describes the instructions for the password field with aria-described by, because it's just a little more complicated. Once again we're looking to see if focus on this field with "pwdFocus" state, but we don't need to see that password already exists because we want it to display as soon as there is focus on this field. It will not display at load time because we do not set the focus. Then we also look to make sure there is not already a valid password. */}
            {/* ? 1.5.4 When we get to listing the allowed special characters — notice what we've to do: we put each one in a <span> and use the "aria-label" attribute, so the screen reader can read the description of each special character. ↓ */}
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle}/>
              8 to 24 characters.<br/>
              Must include uppercase and lowercase letters, a number and a special character.<br/>
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span
              aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span
              aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            {/* ? 1.6.0 The same, but slightly different logic applies to FontAwesomeIcons, which indicate the validity of the password confirmation input. What is different that we'll be also looking for "validMatch", as matching password must have something in it, because if we just left it blank, and it could be a valid match it will show a green checkmark icon, when both fields are empty. */}
            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"}/>
              <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"}/>
            </label>
            {/* 1.6.1 The attributes for confirming the password input are the same as those for the password input above. */}
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {/* 1.6.2 And here we'll just be checking if focus is on confirm password field, and it's not valid match yet. Then this hint will appear. */}
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle}/>
              Must match the first password input field.
            </p>

            {/* 1.7 What about submit button is that we want to keep it disabled until all fields not pass the validation. ↑ */}
            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
          </form>
          <p>
            Already registered?<br/>
            <span className="line">
                            {/*put router link here*/}
              <a href="#">Sign In</a>
                        </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;