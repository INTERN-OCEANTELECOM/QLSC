import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./modaldeleteuser.scss";
import { deleteUser } from "../../../../service/service";
import { ToastContainer, toast } from "react-toastify";

const ModalDeleteUser = (props) => {

  const { show, handleClose, dataDeleteUser } = props;

  // hande delete user
  const confirmDelete = async () => {
    try {
      let res = await deleteUser(dataDeleteUser.email);
      console.log(res);
      if (res && res.statusCode === 200) {
        toast.success("Xóa thành công!!!");
        handleClose();
      } else {
        toast.error("Xóa không thành công!!");
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi xóa người dùng!!");
      handleClose();
    }
  };
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>Bạn có chắc muốn xóa không?</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
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

export default ModalDeleteUser;
