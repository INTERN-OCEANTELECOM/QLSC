import { React, useEffect, useState } from "react";
import "./admin.scss";
import { Table } from "react-bootstrap";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiEarthAsiaOceania } from "react-icons/gi";
import { RxAvatar } from "react-icons/rx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ModalAddUser from "../Modal/USER/ModalAddUser/ModalAddUser";
import ModalDeleteUser from "../Modal/USER/ModalDeleteUser/ModalDeleteUser";
import ModalUpdateUser from "../Modal/USER/ModalUpdateUser/ModalUpdateUser";
import { getUserAdmin } from "../../service/service";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLogoutRedux,
  handleRefresh,
} from "../../redux/actions/userAction";
import logo from "../../assets/logo_28-06-2017_LogoOceanTelecomtailieupng-removebg-preview.png";

const Admin = () => {
  
  const [isShowAddUser, setIsShowAddUser] = useState(false);
  const [isShowDeleteUser, setIsShowDeleteUser] = useState(false);
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [listUser, setListUser] = useState("");
  const [search, setSearch] = useState("");
  const [dataEditUser, setDataEditUser] = useState();
  const [dataDeleteUser, setDataDeleteUser] = useState();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  //handle refresh web
  useEffect(() => {
    if (localStorage.getItem("email")) {
      dispatch(handleRefresh());
    }
  }, []);

  // call api on page load
  useEffect(() => {
    getUser();
    if (user && user.auth === false && window.location.pathname !== "/signin") {
      navigate("/");
    }
  }, [user]);

  // handle api get all user
  const getUser = async () => {
    let res = await getUserAdmin();
    console.log(res);
    if (res && res.data) {
      setListUser(res.data);
    }
  };

  // handle log out
  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  // handle close modal
  const handleCloses = () => {
    setIsShowAddUser(false);
    setIsShowDeleteUser(false);
    setIsShowUpdateUser(false);
    getUser();
  };

  // handle search user
  const handleSearch = () => {
    if (search) {
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = listUser.filter(
        (item) =>
          item.fullName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phoneNumber.toLowerCase().includes(search.toLowerCase())
      );
      setListUser(cloneListUser);
    } else {
      getUser();
    }
  };

  // handle filter role
  const handleRoleSelect = (role) => {
    if (role) {
      console.log(role);
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = listUser.filter(
        (item) => item.roles[0].roleName === role
      );
      setListUser(cloneListUser);
    }
    if (role === "all") {
      getUser();
    }
  };

  // handle edit user (enable modal and get user)
  const hanldeEditUser = (user) => {
    setDataEditUser(user);
    setIsShowUpdateUser(true);
  };

  // handle delete user
  const handleDeleteUser = (user) => {
    setIsShowDeleteUser(true);
    setDataDeleteUser(user);
    console.log(user);
    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = listUser.filter((item) => item.email !== user.email);
    setListUser(cloneListUser);
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="admin">
      <div className="navbars shadow-sm  bg-white rounded">
        {/* navbar */}

        <Navbar bg="" expand="lg" className="px-4">
          <Navbar.Brand href="/">
            <div className="header-logo">
              <GiEarthAsiaOceania className="icon-ocean" />
              OCEAN QLSC
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                <NavLink to="/admin" className="nav-link">
                  Quản lý User
                </NavLink>
              ) : null}
              <NavLink to="/history" className="nav-link">
                Nhật ký
              </NavLink>
            </Nav>
            <Nav>
              {user && user.email ? (
                <span className="nav-link">{user.email}</span>
              ) : (
                <RxAvatar className="icon-avatar" />
              )}
            </Nav>
            <Nav>
              {user && user.auth === true ? (
                <NavDropdown.Item
                  onClick={() => handleLogout()}
                  className="nav-link"
                >
                  Đăng xuất
                </NavDropdown.Item>
              ) : (
                <NavLink to="/signin" className="nav-link">
                  Đăng nhập
                </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      {/* button add, search */}
      {/* check role */}
      {localStorage.getItem("role") === "ROLE_ADMIN" ? (
        <div className="po-table">
          <div className="my-3 add-new d-flex justify-content-between">
            <div className="col-3 btn-search input-group w-25">
              <input
                className="form-control"
                placeholder="Search..."
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(e) => handlePressEnter(e)}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSearch()}
              >
                <AiOutlineSearch />
              </button>
            </div>
            <div className="group-btn d-flex">
              <div className="update">
                <button
                  className="btn btn-success"
                  onClick={() => setIsShowAddUser(true)}
                >
                  <AiFillFileAdd />
                  Add New User
                </button>
              </div>
            </div>
          </div>

          {/* table user */}
          <Table striped bordered className="table-shadow">
            <thead>
              <tr>
                <th>Stt</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>
                  <NavDropdown title="Quyền" className="role-user">
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_ADMIN")}
                    >
                      admin
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_USER")}
                    >
                      user
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_MANAGER")}
                    >
                      manager
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_QLSC")}
                    >
                      QLSC
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_QLPO")}
                    >
                      QLPO
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleRoleSelect("ROLE_KSCANALYST")}
                    >
                      kcs
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleRoleSelect("all")}>
                      Tất cả
                    </NavDropdown.Item>
                  </NavDropdown>
                </th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listUser &&
                listUser.length > 0 &&
                listUser.map((item, index) => {
                  if (item.removed === true) {
                    return null;
                  }
                  const roleName =
                    item.roles && item.roles.length > 0
                      ? item.roles[0].roleName
                      : "";
                  return (
                    <tr key={`sc-${index}`}>
                      <td>{index + 1}</td>
                      <td>{item.fullName}</td>
                      <td>{item.email}</td>
                      <td>{item.phoneNumber}</td>
                      <td>{roleName}</td>
                      <td>
                        {item.status === 0 && "Mới"}
                        {item.status === 1 && "Đã đổi mật khẩu"}
                        {item.status === 2 && "Đã xóa"}
                      </td>
                      <td>
                        {item.status !== 2 && (
                          <>
                            <button
                              className="btn btn-warning mx-1 btn-sm"
                              onClick={() => hanldeEditUser(item)}
                            >
                              Edit
                            </button>
                            {item.email !== localStorage.getItem("email") && (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteUser(item)}
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      ) : (
        <>
          <div>
            <img src={logo} className="logo-ocean-admin" />
            <div className="title">
              <h1 className="title-welcom">Chào mừng bạn đến với OCEAN QLSC</h1>
              <h4 className="title-sign">
                Vui lòng đăng nhập để xem chi tiết:{" "}
                <Link className="sign-account" to="/signin">
                  Đăng nhập ngay
                </Link>
              </h4>
            </div>
          </div>
        </>
      )}

      {/* Modal add user */}
      <ModalAddUser show={isShowAddUser} handleClose={handleCloses} />

      {/* Modal delete user */}
      <ModalDeleteUser
        show={isShowDeleteUser}
        handleClose={handleCloses}
        dataDeleteUser={dataDeleteUser}
      />

      {/* Modal edit user */}
      <ModalUpdateUser
        show={isShowUpdateUser}
        handleClose={handleCloses}
        dataEditUser={dataEditUser}
      />
    </div>
  );
};

export default Admin;
