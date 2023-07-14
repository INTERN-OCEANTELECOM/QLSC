import React from "react";
import Alert from "react-bootstrap/Alert";
import "./privateroute.scss";
import { useSelector } from "react-redux";

const PrivateRoutes = (props) => {
  const user = useSelector(state => state.user.account)

  if (user && !user.auth) {
    return (
      <>
        <Alert variant="danger" className=" error-login">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Đăng nhập để hiển thị</p>

          <a href="/"> Về trang chủ</a>
        </Alert>
      </>
    );
  }

  return <>{props.children}</>;
};

export default PrivateRoutes;
