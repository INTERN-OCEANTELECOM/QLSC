import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GiEarthAsiaOceania } from "react-icons/gi";
import "./header.scss";
import { ToastContainer, toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineSetting } from "react-icons/ai";
import Dropdown from "react-bootstrap/Dropdown";
import ModalUpdateInforUser from "../Modal/USER/ModalUpdateUser/ModalUpdateInfoUser";
import { getUserByEmail } from "../../service/service";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../../redux/actions/userAction";
import moment from "moment";

export const Header = () => {
  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShowModalUpdate, SetIsShowModalUpdate] = useState(false);
  const [dataGetUser, setDataGetUser] = useState("");

  useEffect(() => {
    if (user && user.auth === false && window.location.pathname !== "/signin") {
      navigate("/");
    }

    const autoLogoutAtSpecificTime = () => {
      const now = moment();
      const targetTime = moment()
        .startOf("day")
        .add(23, "hours")
        .add(59, "minutes"); 
      if (now.isAfter(targetTime)) {
        targetTime.add(1, "day"); // Nếu đã quá thời gian 0 giờ 0 phút hôm nay, chuyển sang ngày tiếp theo
      }
      const millisecondsUntilTargetTime = targetTime.diff(now);

      setTimeout(() => {
        handleLogout();
        autoLogoutAtSpecificTime(); // Gọi đệ quy để thiết lập logout tiếp theo vào lúc 0 giờ 0 phút của ngày tiếp theo
      }, millisecondsUntilTargetTime);
    };

    if (user && user.auth) {
      autoLogoutAtSpecificTime(); // Kích hoạt tự động logout nếu người dùng đã đăng nhập thành công
    }
  }, [user, dispatch]);

  // handle logout
  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  // handle close modal update user
  const handleCloses = () => {
    SetIsShowModalUpdate(false);
  };

  // get user by email
  const handleGetUser = async () => {
    SetIsShowModalUpdate(true);
    let res = await getUserByEmail();
    if (res && res.statusCode === 200) {
      setDataGetUser(res.data);
    }
  };

  return (
    <>
      <div className="navbars shadow-sm bg-white rounded">
        <Navbar bg="" expand="lg" className="px-4">
          <Navbar.Brand href="/">
            <div className="header-logo">
              <GiEarthAsiaOceania className="icon-ocean" />
              OCEAN QLSC
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) ||
              window.location.pathname === "/" ||
              window.location.pathname === "/quanly" ||
              window.location.pathname === "/sanpham" ||
              window.location.pathname === "/sn-check" ||
              window.location.pathname === "/barcode-check" ||
              window.location.pathname === "/quan-li-sua-chua") && (
              <>
                {localStorage.getItem("role") === "ROLE_ADMIN" ||
                localStorage.getItem("role") === "ROLE_MANAGER" ? (
                  <Nav className="me-auto nav-bar">
                    <NavLink to="/" className="nav-link">
                      Hợp đồng
                    </NavLink>
                    <NavLink to="/quanly" className="nav-link">
                      QLPO
                    </NavLink>
                    <NavLink to="/quan-li-sua-chua" className="nav-link">
                      QLSC
                    </NavLink>
                    <NavLink to="/sanpham" className="nav-link">
                      QL Mã HH
                    </NavLink>
                  </Nav>
                ) : null}

                {localStorage.getItem("role") === "ROLE_QLSC" ||
                localStorage.getItem("role") === "ROLE_KCSANALYST" ? (
                  <Nav className="me-auto nav-bar">
                    <NavLink to="/quan-li-sua-chua" className="nav-link">
                      QLSC
                    </NavLink>
                  </Nav>
                ) : null}

                {localStorage.getItem("role") === "ROLE_QLPO" ? (
                  <Nav className="me-auto nav-bar">
                    <NavLink to="/" className="nav-link">
                      Hợp đồng
                    </NavLink>
                    <NavLink to="/quanly" className="nav-link">
                      QLPO
                    </NavLink>
                    <NavLink to="/sanpham" className="nav-link">
                      QL Mã HH
                    </NavLink>
                  </Nav>
                ) : null}
                <div className="d-flex align-items-center ms-auto">
                  <Nav className="user-name ">
                    {user && user.email ? (
                      <span className="nav-link">{user.email}</span>
                    ) : (
                      <RxAvatar className="icon-avatar" />
                    )}
                  </Nav>
                  <Nav>
                    <div className="nav-link"></div>
                    {user && user.auth === true ? (
                      <>
                        <Dropdown>
                          <Dropdown.Toggle variant="" id="dropdown-basic">
                            <AiOutlineSetting className="icon-avatar" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={handleGetUser}>
                              Cập nhật tài khoản
                            </Dropdown.Item>
                            <Dropdown.Item href="/reset-password">
                              Đổi mật khẩu
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <NavDropdown.Item
                          onClick={() => handleLogout()}
                          className="nav-link"
                        >
                          Đăng xuất
                        </NavDropdown.Item>
                      </>
                    ) : (
                      <NavLink to="/signin" className="nav-link">
                        Đăng nhập
                      </NavLink>
                    )}
                  </Nav>
                </div>
              </>
            )}
          </Navbar.Collapse>
        </Navbar>

        {/* toast notify */}
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

        {/* modal update info user */}
        <ModalUpdateInforUser
          show={isShowModalUpdate}
          handleClose={handleCloses}
          dataGetUser={dataGetUser}
        />
      </div>
    </>
  );
};
