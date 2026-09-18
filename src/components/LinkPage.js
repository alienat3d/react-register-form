import {Link} from "react-router-dom";

const LinkPage = () => {
  return (
    <section className="link-page nav-window">
      <h1>Links</h1>
      <strong className="message">Public</strong>
      <ul className="link-page__nav">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
      <strong className="message">Private</strong>
      <ul className="link-page__nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/editor">Editor Page</Link></li>
        <li><Link to="/admin">Admin Page</Link></li>
        <li><Link to="/lounge">The Lounge</Link></li>
      </ul>
    </section>
  );
};

export default LinkPage;