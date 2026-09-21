// 5.3.0 Here we'll need to import "axios" and "useAuth" as well.
import useAuth from "./useAuth";
import axios from "../api/axios";

const useRefreshToken = () => {
  // 5.3.1 Next, we'll pull in the "setAuth" from "useAuth" hook.
  const {setAuth} = useAuth();

  // 5.3.2 And we'll creat an async function called "refresh" and use "axios" inside of it with the "get" method. We'll be passing in "/refresh" endpoint as the 1st argument and as the 2nd there will be an options object with "withCredentials" set to true (which allows us to send cookies with request). And this request is going to send along our cookie that has the response token. It's a secure cookie that we never see inside our JavaScript code, but axios can send it to the backend endpoint that we needed to.
  const refresh = async () => {
    const response = await axios.get("/refresh", {withCredentials: true});

    // 5.3.3 After that, we're going to call the state updater function "setAuth" and pass in a "previous function". First, let's display the previous state in the console so we can compare it to the current one. Second, we'll display the "accessToken" from the response that we get back from this endpoint after our refresh token is verified. We should receive a new access token at this point.
    // 5.3.4.0 And then we'll return our previous state "...prev" and overwrite "accessToken" with the new access token, because we'll call this function when our initial request fails and the access token is expired. Then it will refresh, get a new token, and we will retry the request.
    // 5.3.4.1 Also lets include roles to what we're returning: "response.data.roles || prev?.roles" to prevent losing the user's role array when state refreshes. This line ensures roles are maintained across refresh cycles.
    setAuth(prev => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return {
        ...prev,
        roles: response.data.roles || prev?.roles,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  };

  // 5.3.5 And we're returning that function here from this hook.
  // (Go to [src/components/Users.js])
  return refresh;
};

export default useRefreshToken;