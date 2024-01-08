import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center gap-3" style={{ minHeight: '100vh' }}>
      <h1>Oops!</h1>
      <h2>404 Not Found</h2>
      <div className="error-details">
        Sorry, an error has occured, Requested page not found!
      </div>
      <div className="error-actions">
        <Link to={'/dashboard'} className="btn btn-primary">
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
