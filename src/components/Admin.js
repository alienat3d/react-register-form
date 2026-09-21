import {Link} from "react-router-dom";
// 5.2.0 We'll import the new "Users" component here so that we can use it on the Admin page.
import Users from "./Users";

// 5.2.1 But we can't really see the users list, although we logged in with "Admin" role. And it's because we're not sending access token yet. But we won't implement it in our component, instead we want to implement it so we can use a private version of "axios" and use those tokens with it anytime we use that instance of "axios". So, for that we'll need another custom hook "useRefreshToken".
// (Go to [src/hooks/useRefreshToken.js])

const Admin = () => {
  return (
    <section className="nav-window">
      <h1>Admins</h1>
      <Users/>
      <Link className="btn" to="/">Home</Link>
    </section>
  );
};

export default Admin;