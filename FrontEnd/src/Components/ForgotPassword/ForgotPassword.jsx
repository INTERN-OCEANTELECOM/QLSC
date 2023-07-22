import React, { useState } from "react";
import "./forgotpassword.scss";
import avatar from "../../assets/avatar.svg";
import bg from "../../assets/bg.svg";
import wave from "../../assets/wave.png";
import { AiOutlineUser } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { verifyAPI } from "../../service/service";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isValidation, setIsValidation] = useState("");
  const [isValidationEmail, setIsValidationEmail] = useState("");
  const [isValidationPassword, setIsValidationPassword] = useState("");
  const [isValidationRePassword, setIsValidationRePassword] = useState("");
  const [isValidateSuccess, setIsValidateSucess] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // handle verify email and otp
  const handleVerify = async () => {
    // check format email
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail.com$/;
    // validate email, otp, password, confirmPassword
    if (!email || !otp || !password || !confirmPassword) {
      setIsValidation("Email/OTP/Password is required!");
      setIsValidationEmail("");
      setIsValidationPassword("");
      setIsValidationRePassword("");
      return;
    } else {
      setIsValidation("");
    }

    if (!emailRegex.test(email)) {
      setIsValidationEmail("Email không đúng định dạng");
      setIsValidation("");
      setIsValidationPassword("");
      setIsValidationRePassword("");
      return;
    } else {
      setIsValidationEmail("");
    }
    if (password.length < 8) {
      setIsValidationPassword("Mật khẩu phải chứa ít nhất 8 kí tự");
      setIsValidationEmail("");
      setIsValidation("");
      setIsValidationRePassword("");
      return;
    } else {
      setIsValidationPassword("");
    }
    if (password !== confirmPassword) {
      setIsValidationRePassword("Mật khẩu nhập lại không đúng");
      setIsValidationEmail("");
      setIsValidation("");
      setIsValidationPassword();
      return;
    } else {
      setIsValidationRePassword("");
    }

    let res = await verifyAPI(otp, email, password, confirmPassword);
    if (res && res.statusCode === 200) {
      setIsValidateSucess("Đã đổi mật khẩu thành công!!");
      await delay(3000);
      navigate("/signin");
    } else {
      setIsValidation("Email/OTP incorrect");
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleVerify();
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
            <img src={avatar} />
            <h2 className="title">Xác thực và đặt mật khẩu</h2>
            {/* check validate */}
            <div className="validation-otp">{isValidation}</div>
            <div className="validation-otp-success">{isValidateSuccess}</div>
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
                />
              </div>
            </div>
            {/* check validate */}
            <span className="otp-email">{isValidationEmail}</span>
            <div className="input-div one">
              <div className="i">
                <AiOutlineUser />
              </div>
              <div className="div">
                <input
                  type="text"
                  className="input"
                  placeholder="OTP"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </div>
            </div>
            <div className="input-div pass">
              <div className="i">
                <RiLockPasswordLine />
              </div>
              <div className="div input-pass">
                <input
                  type={isShowPassword === true ? "text" : "password"}
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div onClick={() => setIsShowPassword(!isShowPassword)}>
                  {isShowPassword === true ? (
                    <AiFillEye className="icon-eye" />
                  ) : (
                    <AiFillEyeInvisible className="icon-eye" />
                  )}
                </div>
              </div>
            </div>
            {/* check validate */}
            <span className="otp-password">{isValidationPassword}</span>
            <div className="input-div pass">
              <div className="i">
                <RiLockPasswordLine />
              </div>
              <div className="div input-pass">
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onKeyDown={(e) => handlePressEnter(e)}
                />
              </div>
            </div>
            {/* check validate */}
            <span className="otp-repassword">{isValidationRePassword}</span>
            <button className="btn btn-login" onClick={() => handleVerify()}>
              {" "}
              Submit
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
