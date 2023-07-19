import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./modaladduser.scss";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { postCreateUser, role } from "../../../../service/service";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";

const ModalAddUser = (props) => {
  const { show, handleClose } = props;
  const [roleName, setRoleName] = useState("Choose Role");
  const [roleID, setRoleID] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creator, setCreator] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState("");
  const [validateEmail, setValidateEmail] = useState("");
  const [validatePhone, setValidatePhone] = useState("");
  const [validatePassword, setValidatePassword] = useState("");

  // get role when call handleRole
  useEffect(() => {
    // handleRole();
    // handleRole2();
    // handleRole3();
  }, []);

  const handleItemClick = (itemName, itemRoleID) => {
    setRoleName(itemName);
    setRoleID(itemRoleID);
  };

  // handle role admin
  const handleRole = async (index) => {
    let res = await role();
    console.log(res);
    if (res && res.statusCode === 200) {
      setRoleID(res.data[index]);
      setRoleName(res.data[index].roleName);
    }
  };

  // handle add user
  const handleSubmit = async () => {
    // check validate
    if (!fullName || !email || !phone || !password) {
      setValidate("Cần điền đầy đủ thông tin để thêm user");
      return;
    } else {
      setValidate("");
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/;
    if (!emailRegex.test(email)) {
      setValidateEmail("Email không đúng định dạng");
      return;
    } else {
      setValidateEmail("");
    }

    const phoneRegex = /^0\d{9}/;
    if (!phoneRegex.test(phone)) {
      setValidatePhone("Số điện thoại không đúng định dạng");
      return;
    } else {
      setValidatePhone("");
    }

    if (password.length < 8) {
      setValidatePassword("Mật khẩu phải chứa ít nhất 8 kí tự");
      return;
    } else {
      setValidatePassword("");
    }
    // call api
    let res = await postCreateUser(fullName, email, phone, password, 0, [
      roleID,
    ]);
    if (res && res.statusCode === 200) {
      handleClose();
      setFullName("");
      setEmail("");
      setPhone("");
      setCreator("");
      setPassword("");
      toast.success("Thêm thành công");
    } else if (
      res &&
      res.statusCode === 205 &&
      res.statusMessage === "REQUEST FAILURE! DATA NOT MAPPING"
    ) {
      setValidate("Email đã tồn tại!!!");
    } else {
      setValidate("");
    }
  };

  return (
    <>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={show} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Add new User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={handleSubmit}>
              <Row className="mb-2 m-xl-1 validate">{validate}</Row>
              <Row className="mb-3">
                <Form.Group md="4" controlId="validationCustom01">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group md="4" controlId="validationCustom02">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <span className="validate-add">{validateEmail}</span>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group md="4" controlId="validationCustom03">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  <span className="validate-add">{validatePhone}</span>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group md="4" controlId="validationCustomUsername1">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={isShowPassword === true ? "text" : "password"}
                      placeholder="Mật khẩu"
                      aria-describedby="inputGroupPrepend"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <InputGroup.Text id="inputGroupPrepend">
                      <div onClick={() => setIsShowPassword(!isShowPassword)}>
                        {isShowPassword === true ? (
                          <AiFillEye className="icon-eye-add" />
                        ) : (
                          <AiFillEyeInvisible className="icon-eye-add" />
                        )}
                      </div>
                    </InputGroup.Text>
                  </InputGroup>
                  <span className="validate-add">{validatePassword}</span>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group md="4" controlId="validationCustom09">
                  <Form.Label>Role</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle variant="light">
                      {roleName}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleRole(0)}>
                        Admin
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRole(1)}>
                        Manager
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRole(2)}>
                        User
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRole(3)}>
                        Repair
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRole(4)}>
                        KCS
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ModalAddUser;
