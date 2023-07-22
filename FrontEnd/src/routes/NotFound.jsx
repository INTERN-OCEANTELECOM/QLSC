import React from "react";
import Alert from "react-bootstrap/Alert";
import "./privateroute.scss";
import { useSelector } from "react-redux";

const NotFound = (props) => {
  const user = useSelector((state) => state.user.account);

  if (user && !user.auth) {
    return (
      <>
        {/* <Alert variant="success"> */}
        {/* <Alert.Heading>Not Found</Alert.Heading> */}
        <div className="d-flex align-items-center justify-content-center vh-100" >
          <div className="text-center">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3">
              {" "}
              <span className="text-danger">Opps!</span> Page not found.
            </p>
            <p className="lead">The page you’re looking for doesn’t exist.</p>
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>
        {/* </Alert> */}
      </>
    );
  }

  return <>{props.children}</>;
};

export default NotFound;
