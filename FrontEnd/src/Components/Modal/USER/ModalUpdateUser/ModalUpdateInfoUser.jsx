import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./modalupdateuser.scss";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { updateUser } from "../../../../service/service";
import { toast } from "react-toastify";

const ModalUpdateInforUser = (props) => {

  const { show, handleClose, dataGetUser } = props;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleID] = useState("");
  const [validate, setValidate] = useState("");

  // check if show then get data user
  useEffect(() => {
    if (show) {
      setFullName(dataGetUser.fullName);
      localStorage.setItem("emailEdit", dataGetUser.email);
      setPhone(dataGetUser.phoneNumber);
    }
  }, [dataGetUser]);

  // handle update user
  const handleUpdateUser = async () => {
    let res = await updateUser(
      localStorage.getItem("emailEdit"),
      fullName,
      phone,
      dataGetUser.roles
    );
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thông tin thành công !!");
      localStorage.removeItem("emailEdit");
    } else {
      handleClose();
      toast.error("Cập nhật thông tin không thành công !!");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
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
              <Form.Group md="4" controlId="validationCustom03">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateInforUser;
