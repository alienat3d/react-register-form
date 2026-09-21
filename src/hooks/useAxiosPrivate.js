import {axiosPrivate} from "../api/axios";
import {useEffect} from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// 5.6.0 Then, we'll create a hook here that attaches those axios interceptors. First, we'll need to define the "refresh" function that we'll get from the custom hook "useRefreshToken". And we'll also need "auth" state, that we pull in from the "useAuth" hook.
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const {auth} = useAuth();

  // 5.6.2 We'll use here the "useEffect" hook with the dependencies "auth" state and "refresh" func both.
  // ? 5.6.3 Now, talking about interceptors you can think if these much like VanillaJS event listeners. They get attached, but we'll also need to remove it, because if now they'll be attached more and more, and we wouldn't want to create a mess with our requests and responses.
  useEffect(() => {
    // 5.6.11 Lets comeback here and create an interceptor for the request too. And it's pretty similar to "responseIntercept". Inside the user function there will be config, and we'll be checking if the "Authorization" header doesn't exist then we know it's not a retry, as this will be the 1st attempt. Then we'll access that header and assign the string with access token to it, that we get from "auth" state. So, this access token could be given initially when user signed in or could be an access token that user got after a refresh either way. But this will be the initial request, as we know that "Authorization" header wasn't set yet, so we're passing that in. Otherwise, if it's set we know it's a retry, and it's already been set at "responseIntercept" part after 403 error and a failed request.
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        // 5.6.12 And then we just return the "config" here.
        return config;
        // 5.6.13 Now, we do need to handle an error here as well if it would occur. So, here after "," we'll have an anonymous function with an error inside and then use "Promise.reject", where we pass an error in. ↓
      }, (err) => Promise.reject(err),
    );

    // 5.6.4 We'll create the response interceptor first here. So, inside the method "use" we'll say: if response is good then just return it, but if there is an error we'll want to have an error handler here for that. This is for example if token has expired, as we have an access token with a short time span or short life span and if it's expired we'll be in this async error handler then. And inside of it we want to get the previous request and to get it from axios we'll access the config property (we're using optional chaining to be safe if for some reason the config wouldn't exist).
    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (err) => {
        const prevRequest = err?.config;

        // 5.6.5 Then, we check if there is an error with a status, and it's value 403 "forbidden", then we know that request is failed due to an expired access token. And then we also want to check a custom property on the request that we'll set called "sent". And so saying if "sent" doesn't exist or if it's value false (we're doing that to avoid to get in this endless loop that could happen of 403, and we only want to retry once and that "sent" property indicates that).
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          // 5.6.6 Here we'll get a new access token by calling "refresh" function.
          const newAccessToken = await refresh();

          // 5.6.7 Then, we'll access the previous request and get into the "headers" and further into "Authorization" setting and this is where we set the token, so we'll set this to a new access token with the "Bearer " string in front of it.
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // 5.6.8 After we have a new access token set in there all we need to do is return and call "axiosPrivate" again and pass "prevRequest" into it. Now, we've updated the request with refresh token, and we should have a new access token and now we're making the request again.
          return axiosPrivate(prevRequest);
        }

        // 5.6.9 Well, when the if-statement above wasn't truthy we need to have an error handler here. So, we'll return here a "Promise.reject" with an error in it.
        return Promise.reject(err);
      },
    );
    // 5.6.10 As it been mentioned before, these interceptors don't remove themselves and could pile on. So, let's use this cleanup function inside the "useEffect" hook, which is just perfect for removing them. We'll use the interceptors method "eject" for this and pass the interceptor in it. And that's how it'll be removed. ↑
    // 5.6.14 The only thing that remains here is to add the "eject" method for the request interceptor as well.
    // (Go to [src/components/Users.js])
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  // 5.6.1 We'll be returning just "axiosPrivate" instance here, but by the time this hook is finished his work we'll have the interceptors attached to the request and response of the axios instance. ↑
  return axiosPrivate;
};

export default useAxiosPrivate;