import {Link} from "react-router-dom";

const Editor = () => {
  return (
    <section className="nav-window">
      <h1>Editors</h1>
      <strong className="message">You must have been assigned an Editor role!</strong>
      <Link className="btn" to="/">Home</Link>
    </section>
  );
};

export default Editor;