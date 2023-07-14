import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./signin.scss";
import avatar from "../../assets/avatar.svg";
import bg from "../../assets/bg.svg";
import wave from "../../assets/wave.png";
import { AiOutlineUser } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { loginAdmin } from "../../service/service";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalBlogLogin from "../Modal/ModalBlogLogin/ModalBlogLogin";
import { handleLoginRedux } from "../../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isValidation, setIsValidation] = useState("");
  const [isValidationEmail, setIsValidationEmail] = useState("");
  const [isValidationPassword, setIsValidationPassword] = useState("");
  const [isShowBlog, setIsShowBlog] = useState(false);
  const [dataSignIn, setDataSignIn] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);

  // check remember password
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      const { email, password } = JSON.parse(rememberedUser);
      setEmail(email);
      setPassword(password);
      setRememberPassword(true);
    } else {
      setRememberPassword(false);
    }
  }, []);

  // display permissions
  useEffect(() => {
    if (account && account.auth === true && account.status === 2) {
      navigate("/");
    } else if (account && account.auth === true && account.status === 1) {
      navigate("/admin");
    } else if (account && account.auth === true && account.status === 3) {
      setIsValidation("Email/Password không đúng !!");
    } else if (account && account.auth === true && account.status === 4) {
      console.log("lock 132");
      setIsShowBlog(true);
      setDataSignIn(localStorage.getItem("timelock"));
    } else if (account && account.auth === false && account.status === 0) {
      navigate("/reset-password");
      account.status = 2;
    }
  }, [account]);

  // handle close lock account
  const handleClose = () => {
    setIsShowBlog(false);
  };

  // handle login api
  const handleLogin = async () => {
    // check validate
    const emailRegex = /^[A-Za-z0-9._%+-]+@(gmail|daiduongtelecom)\.com$/;
    if (!email || !password) {
      setIsValidation("Email/Password is required!");
      return;
    } else {
      setIsValidation("");
    }
    if (!emailRegex.test(email)) {
      setIsValidationEmail("Email không đúng định dạng");

      return;
    } else {
      setIsValidationEmail("");
    }
    if (password.length < 8) {
      setIsValidationPassword("Mật khẩu phải chứa ít nhất 8 kí tự");

      return;
    } else {
      setIsValidationPassword("");
    }

    dispatch(handleLoginRedux(email, password));
    if (rememberPassword) {
      localStorage.setItem(
        "rememberedUser",
        JSON.stringify({ email, password })
      );
    } else {
      localStorage.removeItem("rememberedUser");
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
            <h2 className="title">Welcome</h2>
            <div className="validation-signin">{isValidation}</div>
            <div className="input-div one">
              <div className="i">
                <AiOutlineUser />
              </div>
              <div className="div">
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <span className="validate-email">{isValidationEmail}</span>
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
            <span className="validate-password">{isValidationPassword}</span>
            <div className="forgot-signin">
              <div>
                <input
                  type="checkbox"
                  id="rememberPasswordCheckbox"
                  checked={rememberPassword}
                  onChange={(e) => setRememberPassword(e.target.checked)}
                />
                <label
                  htmlFor="rememberPasswordCheckbox"
                  className="remember-password"
                >
                  Nhớ mật khẩu
                </label>
              </div>
              <Link to="/check-email">Quên mật khẩu</Link>
            </div>
            <button className="btn btn-login" onClick={() => handleLogin()}>
              {" "}
              Đăng nhập
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

      <ModalBlogLogin
        show={isShowBlog}
        handleClose={handleClose}
        dataSignIn={dataSignIn}
      />
    </div>
  );
};

export default Signin;
