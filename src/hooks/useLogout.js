// ? 6.4.0 Let's think about another problem: what if user doesn't sign out, and somebody else comes along and goes to the site with all the user's permissions. User logged in until his refresh token expires unless we hit that "/logout" endpoint and connect it to the "Sign Out" button. So, when we'll look at the "logoutController.js" in our Server API code we'll see that it expects to receive a cookie and if it doesn't it just returns status code 204 "No content" because there's nothing to log out if there is no cookie there, then there is nothing to delete. However, going down by code we're trying to get the refresh token from the cookie, so we need to send the cookie back when we hit this log out endpoint and then further down in the code the cookie will be cleared and that will keep the user from being logged back in when they don't expect it. So we need to actually manually apply a way to log out and that way a user won't be logged in until that refresh token expires (which again the refresh token does need to be set to expire at some point).
// 6.4.1 So, let's create another custom hook (this one) to handle that logout problem we just described above, and we'll need to import here our "axios" instance and also the "useAuth" custom hook too.
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const useLogout = () => {
  // 6.4.2 And we'll grab the "setAuth" function here.
  const {setAuth} = useAuth();

  // 6.4.3 Then, we'll define the "logout" function, as this hook is going to return the function and not a value. And we'll start out by setting auth state back to an empty object when we log out.
  const logout = async () => {
    setAuth({});

    // 6.4.4 Next, in a "try" block we'll define "response" where we'll assign "axios" with the "/logout" endpoint as 1st argument and 2nd will be the settings object, where we'll set "withCredentials" to true. That way we'll send that secure cookie back with this request to this endpoint.
    // (Go to [src/components/Home.js])
    try {
      const response = await axios("/logout", {withCredentials: true});
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;