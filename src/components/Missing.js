import {Link} from "react-router-dom";

const Missing = () => {
  return (
    <section className="nav-window">
      <h1>404 Error:</h1>
      <strong className="message">Requested page isn't found!</strong>
      <Link className="btn" to="/">Home</Link>
    </section>
  );
};

export default Missing;