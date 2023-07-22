import  React, {useEffect, useState } from "react";
import "./diary.scss";
import { Form, Table } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiEarthAsiaOceania } from "react-icons/gi";
import { RxAvatar } from "react-icons/rx";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getHistory } from "../../service/service";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  handleLogoutRedux,
  handleRefresh,
} from "../../redux/actions/userAction";
import logo from "../../assets/logo_28-06-2017_LogoOceanTelecomtailieupng-removebg-preview.png";
import DatePicker from "react-datepicker";
import moment from "moment";

const Diary = () => {
  const [listHistory, setListHistory] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change date end
  const handleDateChangeEnd = (date) => {
    setSelectedDateEnd(date);
  };

  //handle refresh web
  useEffect(() => {
    if (localStorage.getItem("email")) {
      dispatch(handleRefresh());
    }
  }, []);

  // call api on page load
  useEffect(() => {
    if (user && user.auth === false && window.location.pathname !== "/signin") {
      navigate("/");
    }
  }, [user]);

  // handle log out
  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  const handleHistory = async() => {

    let timeStart;
    let timeEnd;
    if (selectedDateEnd !== null) {
      timeEnd = new Date(selectedDateEnd);
      timeEnd.setHours(23, 59, 59, 99); // Đặt giờ, phút và giây của selectedDateEnd thành 23:59:59
      timeEnd = timeEnd.getTime();
    }

    if (selectedDateStart !== null) {
      timeStart = selectedDateStart.getTime() 
    }
    let res = await getHistory(timeStart, timeEnd);
    console.log(res)
    if(res && res.statusCode == 200) {
      setListHistory(res.data)
    }
      if(res && res.statusCode == 204) {
        setListHistory(res.data);
        alert("Lấy dữ liệu không thành công!!");
      }
    
  }

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
              <NavLink to="/admin" className="nav-link">
                Quản lý User
              </NavLink>
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
        <div className="diary">
          <div className="d-flex justify-content-start align-items-center">
            <div className="d-flex justify-content-center align-items-center ">
              <p className="m-lg-1">Từ</p>
              <DatePicker
                selected={selectedDateStart}
                onChange={handleDateChangeStart}
                customInput={<Form.Control />}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <p className="m-lg-1">Đến</p>
              <DatePicker
                selected={selectedDateEnd}
                onChange={handleDateChangeEnd}
                customInput={<Form.Control />}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
              />
            </div>
            <div>
              <button
                className="btn btn-outline-success m-lg-2"
                onClick={handleHistory}
              >
                Lấy dữ liệu
              </button>
            </div>
          </div>
          {/* table user */}
          <Table striped bordered hover className="table-shadow table-history">
            <thead>
              <tr>
                <th>Stt</th>
                <th>Tên người dùng</th>
                <th>Thời gian</th>
                <th>Đối tượng </th>
                <th>Hành động</th>
                <th >Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {listHistory &&
                listHistory.length > 0 &&
                listHistory.map((item, index) => {
                  const isExpanded = expandedIndex === index;
                  const truncatedSpec = item.specification.slice(0, 1000);
                  const time = item.created;
                  let data;
                  if (time !== null) {
                    data = moment(time).format("DD/MM/YYYY");
                  }

                  // Replace both //n and \n globally in the specification text
                  const formattedSpecification = item.specification.replace(
                    /\/\/n|\\n/g,
                    "\n"
                  );

                  // Split the specification text at newline characters (\n)
                  const specificationLines = formattedSpecification.split("\n");

                  return (
                    <React.Fragment key={`hsr-${index}`}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.email}</td>
                        <td>{data}</td>
                        <td>{item.object}</td>
                        <td>{item.action}</td>
                        <td className="col-descript">
                          <span>
                            {isExpanded ? (
                              specificationLines.map((line, i) => (
                                <span key={`line-${i}`}>
                                  {line}
                                  <br /> {/* Xuống dòng sau mỗi dòng */}
                                </span>
                              ))
                            ) : (
                              // Include line breaks in the truncated specification
                              <React.Fragment>
                                {truncatedSpec.split("//n").map((line, i) => (
                                  <span key={`truncated-line-${i}`}>
                                    {line}
                                    <br /> {/* Xuống dòng sau mỗi dòng */}
                                  </span>
                                ))}
                              </React.Fragment>
                            )}
                          </span>
                          {item.specification.length > 1000 && (
                            <button
                              className="btn btn-link"
                              onClick={() =>
                                setExpandedIndex(isExpanded ? null : index)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                            </button>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
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
    </div>
  );
};

export default Diary;
