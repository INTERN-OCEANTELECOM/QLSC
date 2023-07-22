import React, { useEffect, useState, useContext } from "react";
import "./checkemail.scss";
import bg from "../../assets/bg.svg";
import wave from "../../assets/wave.png";
import { AiOutlineUser } from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";
import { sendOTP } from "../../service/service";
import { useNavigate } from "react-router-dom";

export const CheckEmail = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [validation, setVadilation] = useState("");
  const [validationEmail, setVadilationEmail] = useState("");
  const [loadingOTP, setLoadingOTP] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // handle check mail send OTP
  const handleOTP = async () => {
    // check format mail
    const emailRegex = /^[A-Za-z0-9._%+-]+@(gmail|daiduongtelecom)\.com$/;
    // validate email
    if (!email) {
      setVadilationEmail("Email is required!"); 
      return;
    } else if (!emailRegex.test(email)) {
      setVadilationEmail("Email không đúng định dạng");
      return;
    } else {
      setVadilationEmail("");
    }
    setLoadingOTP(true);
    let res = await sendOTP(email);

    if (res && res.statusCode === 200) {
      setVadilation("OTP được gửi thành công. Vui lòng kiểm tra email");
      setLoadingOTP(false);
      await delay(3000);
      navigate("/forgot-password");
    } else {
      if(res && res.statusCode === 204)
      setVadilationEmail(res.data);
      setLoadingOTP(false);
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleOTP();
    }
  };
  return (
    <div>
      <img className="wave" src={wave} />
      <div className="container">
        <div className="img">
          <img src={bg} />
        </div>
        <div className="login-content">
          <div className="form">
            <p className="notice">Lưu ý: Mỗi lần gửi phải cách nhau 60s</p>
            <p className="validate-otp">{validation}</p>
            <div className="input-div one">
              <div className="i">
                <AiOutlineUser />
              </div>
              <div className="div">
                <input
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(e) => handlePressEnter(e)}
                />
              </div>
            </div>
            <div className="validation-check-email">{validationEmail}</div>
            <button className="btn btn-login" onClick={() => handleOTP()}>
              {loadingOTP && <Spinner animation="border" size="sm" />} Send OTP
            </button>
            <div className="go-back">
              <h2>
                <a href="/">&lt;&lt;&lt;&lt; Về trang chủ</a>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
