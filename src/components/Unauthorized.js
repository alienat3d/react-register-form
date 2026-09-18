import {useNavigate} from "react-router-dom";

const Unauthorized = () => {
  // 4.8.0 One thing to notice here at "Unauthorized" page component is we're using here "useNavigate" hook for creating a simple "goBack" function, that will execute just "navigate(-1)" which means it will just go back to where you came from.
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section className="nav-window">
      <h1>401 Error: Unauthorized</h1>
      <strong className="message">You don't have an access to that page!</strong>
      {/* 4.8.1 And we'll use that function here on the "Back" button, so it will take user, who clicks it back one page in browsing history. */}
      <button onClick={goBack} className="btn">Back</button>
    </section>
  );
};

export default Unauthorized;