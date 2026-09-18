import {Link} from "react-router-dom";

const Lounge = () => {
  return (
    <section className="nav-window">
      <h1>The Lounge</h1>
      <strong className="message">Admins and Editors can hang out here.</strong>
      <Link className="btn" to="/">Home</Link>
    </section>
  );
};

export default Lounge;