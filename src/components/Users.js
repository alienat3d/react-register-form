import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Users = () => {
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {signal: controller.signal});
        // ? 8.1.3 Let's look at another example, where we stored too much state, and it really can be reduced what we're saving in the state and keep some of that confidential information out of the possibility of being viewed by someone we don't want to view it. A good example of that is how we're printing users list at the admin page. But if we'll display they users information from the data we're using to print that list to the page we can see in that array it's all the user information here, including password (although it's encrypted), refresh token, roles and everything. We don't really need all of that here. What we really need for the list is the usernames. And we should change our code in a couple of ways, if we have access to the backend we could just go and make an endpoint that would only deliver the information we need, which would be ideal. But many times we don't have control over the backend endpoint and just have to modify our code on the frontend and only include in state or store the information that we really need like the usernames.
        // 8.1.4 So, here we're logging the response with data from the server, so essentially all the data and inside the "setUsers" we're setting all of that inside, and we don't really need all of that. Let's define just usernames, and we'll be using "map" method for that, and we'll form a new array while only getting usernames in it. ↓
        // console.log(response.data);
        const usernames = response.data.map((user) => user.username);

        // isMounted && setUsers(response.data);
        isMounted && setUsers(usernames);
      } catch (err) {
        console.error(err);
        navigate("/login", {state: {from: location}, replace: true});
      }
    };
    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, location, navigate]);

  return (
    <article>
      <h1>Users List</h1>
      {users?.length ?
        (
          <ul>
            {/* 8.1.5 But then we also need to fix how we're printing usernames in here. */}
            {/* 8.2 The third best practice is to encrypt passwords if you store them anywhere. We already used the "bcrypt" library (https://www.npmjs.com/package/bcrypt) in the Node.js course when creating the REST API server that we're using for the backend in this course, but we can also use it for the frontend (https://www.npmjs.com/package/bcryptjs). */}
            {/* (Go to [src/components/Login.js]) */}
            {/*{users.map((user, index) => <li key={index}>{user?.username}</li>)}*/}
            {users.map((user, index) => <li key={index}>{user}</li>)}
          </ul>
        ) : <p>There are no signed users yet.</p>}
    </article>
  );
};

export default Users;