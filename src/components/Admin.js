import {Link} from "react-router-dom";

const Admin = () => {
  return (
    <section className="nav-window">
      <h1>Admins</h1>
      <strong className="message">You must have been assigned an Admin role!</strong>
      <Link className="btn" to="/">Home</Link>
    </section>
  );
};

export default Admin;