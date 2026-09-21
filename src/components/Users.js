import {useEffect, useState} from "react";
// 5.8.0 But let's think for a moment about what happens if the refresh token has expired the one that's stored in the cookie? Then, we want the user to re-authenticate, but we want to do that in the least annoying way possible. They will get kicked back out of course to log back in, but then we don't want to just dump them off at the home page. So we want to handle that with React Router that we already implemented with our protected routes. So, we'll need to import and use a couple of things from React Router here such as "useNavigate" & "useLocation". ↓
import {useLocation, useNavigate} from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
// 5.7.0 We need to change something here, as we don't want to use the default "axios" function, but to replace with the "useAxiosPrivate" hook that we've created.
// import axios from "../api/axios";
// import useRefreshToken from "../hooks/useRefreshToken";

const Users = () => {
  // 5.1.0 So, we created this new component, and we'll need to import "useState" here to define the state "users".
  const [users, setUsers] = useState([]);

  // 5.7.1.0 We'll get our "axiosPrivate" instance here and... ↓
  const axiosPrivate = useAxiosPrivate();

  // 5.8.1 Let's define "navigate" & "location" here with the hooks "useNavigate" & "useLocation" accordingly. ↓
  const navigate = useNavigate();
  const location = useLocation();

  // 5.4.0 For the testing purpose we'll import "useRefreshToken" hook and call it here (we won't keep it here permanently though). ↓
  // const refresh = useRefreshToken();

  // 5.1.2 We'll also need to use "useEffect" hook here together with "axios". So it has to run just once when the component loads, so it shall have an empty array with dependencies. Inside we'll creat the variable "isMounted" and set this to true. We'll also define a "controller" that's assigned to "new AbortController()" and its for cancelling a request, and we'll do that if the component unmounts.
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // 5.1.3 Next, we'll define an asynchronous "getUsers" function with a "try...catch" block. In the "try" block, we'll use "axios" with its "get" method. We'll pass in the "/users" endpoint as the first argument and an options object as the second argument. We'll also pass in the controller.signal, which will allow us to cancel the request if necessary.
    const getUsers = async () => {
      try {
        // 5.7.1.1 ... replace "axios" with that private instance here. ↑
        // const response = await axios.get("/users", {signal: controller.signal});
        const response = await axiosPrivate.get("/users", {signal: controller.signal});
        console.log(response.data);

        // 5.1.4 Then, we will check if the "isMounter" value is true. If so, we will use the "setUsers" method to update the "users" state with the data that we just received from the server.
        // 5.1.5.1 So, we're not going to attempt to set the state, as it'll be checked and if it's false, so it won't attempt to run "setUsers" to update the "users" state.
        // (Go to [src/components/Admin.js])
        isMounted && setUsers(response.data);
      } catch (err) {
        // 5.8.2 Next, we'll get back to this place, where we're catching and error inside the getUsers function and here we'll put in "navigate" and set it to bring user to the login page path. But also as the second argument we'll set a state that will help us send the user back to where he was instead of getting dumped back at just a homepage after a new login. And as 3rd argument we'll have "replace" set to true. What this does is take the location that user is coming from, say the admin page, and then it got set to the login. But it's going to replace the "/login" in the browser history with the "location" that user were at. So that after user logged in he'll be sent directly back to where he were. (Actually, we've already done the same thing with Login component before.)
        console.error(err);
        navigate("/login", {state: {from: location}, replace: true});
      }
    };
    getUsers();

    // 5.1.5.0 Let's use the cleanup function that will run, when this component unmounts and where we set "isMounted" to false and call the "abort" method on the "controller". ↑
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, location, navigate]);

  // 5.1.1 Then, we have to create some JSX: an "article" tag containing the Users List. We'll use a ternary operator to check if the users array is empty. If it's not, we'll render a users list. To do that, we'll map over the "users" state. We'll also need the index because a value is required for the "key" attribute of each list item. This will generate a list of users from the "users" state.
  return (
    <article>
      <h1>Users List</h1>
      {users?.length ?
        (
          <ul>
            {users.map((user, index) => <li key={index}>{user?.username}</li>)}
          </ul>
        ) : <p>There are no signed users yet.</p>}
      {/* 5.4.1 We'll also create a button underneath that calls the "refresh" function to see what happens when we click it. The "console.log" that we've already added to the [src/hooks/useRefreshToken.js] file will show us the previous and new access tokens, as the "refresh" function updated it. */}
      {/* 5.4.2 Okay, after we make sure it's all working as it should we can get rid of this button here and hook that is connected to it. */}
      {/*<button onClick={() => refresh()}>Refresh</button>*/}
      {/* (Go to [src/api/axios.js]) */}
    </article>
  );
};

export default Users;