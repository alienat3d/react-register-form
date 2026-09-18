import {Link} from "react-router-dom";

const Home = () => {
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
      <Link className="btn" to="login">Sign Out</Link>
    </section>
  );
};

export default Home;