import {Link, useNavigate} from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Home = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // 6.5.0 Then, we'll import that "useLogout" custom hook where we want to use it.
  // 6.5.1 But we're actually going to make a request to that "/logout" endpoint in backend RestAPI to delete the cookie that has the refresh token and that will allow users manually log out and increase their security.
  // (Go to [src/context/AuthProvider.js])
  const signOut = async () => {
    await logout();
    navigate("/linkpage");
  };

  return (
    <section className="nav-window">
      <h1>Home</h1>
      <strong className="message">You are logged in!</strong>
      <ul className="nav-list">
        <li><Link to="editor">Go to the Editor Page</Link></li>
        <li><Link to="admin">Go to the Admin Page</Link></li>
        <li><Link to="lounge">Go to the Lounge</Link></li>
        <li><Link to="linkpage">Go to the link page</Link></li>
      </ul>
      <button onClick={signOut} className="btn">Sign Out</button>
    </section>
  );
};

export default Home;