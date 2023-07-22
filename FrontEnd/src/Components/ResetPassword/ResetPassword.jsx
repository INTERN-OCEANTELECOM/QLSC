import React, { useState } from "react";
import "./resetpassword.scss";
import avatar from "../../assets/avatar.svg";
import bg from "../../assets/bg.svg";
import wave from "../../assets/wave.png";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { resetPassword } from "../../service/service";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isValidation, setIsValidation] = useState("");
  const [isValidationSucess, setIsValidationSucess] = useState("");
  const [isValidationPassword, setIsValidationPassword] = useState("");
  const [isValidationRePassword, setIsValidationRePassword] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // handle reset password
  const handleLogin = async () => {
    // check validate
    if (!confirmPassword || !password || !oldPassword) {
      setIsValidation("OldPassword/Password is required!");
      setIsValidationPassword("");
      setIsValidationRePassword("");
      return;
    } else {
      setIsValidation("");
    }
    if (password.length < 8) {
      setIsValidationPassword("Mật khẩu phải chứa ít nhất 8 kí tự ");
      setIsValidationRePassword("");
      return;
    } else {
      setIsValidationPassword("");
    }

    if (password !== confirmPassword) {
      setIsValidationRePassword("Mật khẩu nhật lại không đúng");
      setIsValidationPassword("");
      return;
    } else {
      setIsValidationRePassword("");
    }

    let res = await resetPassword(oldPassword, password);
    if (res && res.statusCode === 200) {
      setIsValidationSucess("Đổi mật khẩu thành công!!");
      await delay(2000);
      navigate("/signin");
    } else {
      setIsValidation("Mật khẩu cũ không đúng!!");
    }
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleLogin();
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
            <h2 className="title">Đặt lại mật khẩu</h2>
            <div className="validation">{isValidation}</div>
            <div className="validation-sucess">{isValidationSucess}</div>
            <div className="input-div pass">
              <div className="i">
                <RiLockPasswordLine />
              </div>
              <div className="div input-pass">
                <input
                  type={isShowOldPassword === true ? "text" : "password"}
                  className="input"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                />
                <div onClick={() => setIsShowOldPassword(!isShowOldPassword)}>
                  {isShowOldPassword === true ? (
                    <AiFillEye className="icon-eye" />
                  ) : (
                    <AiFillEyeInvisible className="icon-eye" />
                  )}
                </div>
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
            <span className="reset-password">{isValidationPassword}</span>
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
            <span className="reset-password">{isValidationRePassword}</span>
            <button className="btn btn-login" onClick={() => handleLogin()}>
              {" "}
              Đặt mật khẩu
            </button>
            <div className="go-back">
              <h2>
                <a href="/">&lt;&lt;&lt;&lt; Về trang chủ</a>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
