// ? 6.0.0 Let's add persistent user authentication to our app. Of course, we'll do so securely, without using "localStorage" or "sessionStorage". Imagine logging in as an "admin" and being able to access the admin page and view the user list that we display for anyone with the "admin" role. If you reload the app, it should remember which page you were on and that you were logged in. Even if you leave the app and go to another website, such as www.google.com, and then return, the app should continue to remember that you are logged in. This will happen if you add persistent user authentication to the app, which is what we will work on in this tutorial.
// ? 6.0.1 As mentioned, we have a problem with losing the authorization state if the user refreshes the page, goes to another website, and then returns. The state, as well as the access token, gets lost, and the user gets logged out because they are only stored in memory while the tab with the app is open. However, it should be noted that persistent user authentication makes the app less secure. Therefore, if we are trying to create a secure app with sensitive data, it is better to leave out the persistent user authentication.

import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  // 6.1.0 Alright, let's work on that "persistent user auth" feature, starting with this component. We'll define a state, which will be "isLoading".
  const [isLoading, setIsLoading] = useState(true);

  // 6.1.1 We'll also would need the "refresh" func from our custom hook that refreshes JWT-tokens.
  const refresh = useRefreshToken();

  // 6.1.2 And we'll need to grab the global state "auth" from our custom "useAuth" hook.
  // 6.6.3 We'll also add the "persist" state here. ↓
  // 7.8.4 Yet, it's another place we shall apply a fix is this "PersistLogin" component. As we were pulling in here "persist" and is no longer necessary.
  // const {auth, persist} = useAuth();
  const {auth} = useAuth();

  // 7.8.5 But what we can do here as well, is that we import "useLocalStorage" here and then pull in "persist" from there. And we'll pass in the "key" and the initial value there too.
  // (Go to [src/context/AuthProvider.js])
  const [persist] = useLocalStorage("persist", false);

  // 6.1.3 Next, we'll use the "useEffect" hook that should run just once. Inside of that we'll define a "verifyRefreshToken" async func, where we'll try to call the "refresh" func that is going to reach out to the endpoint and take the cookie with it. When it sends that cookie to the "/refresh" endpoint then it brings us back a new access token. And we want to do that before we get to the "requireAuth" comp. that would kick us back out and that's why we've got this component here.
  useEffect(() => {
    // 6.7.0 Oops! It seems that we forgot to add something here, which is causing a tiny memory leak. To fix it, we need to add the "isMounted" flag and set it to true. ↓
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        // 6.1.4 And we also want to extend this "try...catch" with the "finally" block, as it's the great place to set "isLoading" state to false. Because no matter if we got an error or not this "finally" block is always going to run, and it'll prevent us from getting in this endless loading loop.
        // 6.7.1 And then we'll check that "isMounted" flag if it's truthy before we'll set the "isLoading" state, as we really don't need to set the state to an unmounted component. ↓
        isMounted && setIsLoading(false);
      }
    };

    // 6.1.5 Now, we also brought here "auth" global state and that's important, when we'd reload the page or come back from another site to this app, then we'll have an empty "auth" state. And we want to make sure that we only run this when we don't have that access token. We don't want to hit the "/refresh" endpoint just every time we request a protected page and only do that if we lack an access token. So, we have to check if "auth" with the "accessToken" inside doesn't exist or empty (which means — we don't have an access token) then we'll call "verifyRefreshToken" func, otherwise we'll set "isLoading" to false.
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    // 6.7.2 We can determine whether the component is mounted by using the cleanup function. Therefore, we will set the flag to false when the component is unmounted.
    return () => isMounted = false;
  }, []);

  // 6.2.0 Let's add another "useEffect" here for testing purposes to see what's going on. And it will run any time that "isLoading" state changes. We'll be logging "isLoading" state and also would log a value of access token as well.
  /*useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`accessToken: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);*/

  return (
    <>
      {/* 6.2.1 Inside the JSX we'll put a ternary which checks if "isLoading" state truthy will display "Loading..." message on the page (or maybe you'd prefer some fancy Spinner component on that place), otherwise we'll pass "Outlet" from React Router (which represents all the child routes inside the "PersistLogin" route). */}
      {/* (Go to [src/App.js]) */}
      {/* 6.6.4 Now, let's add the "persist" state to our JSX logic. We'll check if "persist" is falsy; if so, we'll just show the "Outlet". If "persist" is truthy, then the other part of the ternary with the "Loading..." message will come in. */}
      {/* (Go to [src/components/Login.js]) */}
      {!persist ?
        <Outlet/> :
        isLoading ? <p>Loading...</p> : <Outlet/>
      }
    </>
  );
};

export default PersistLogin;