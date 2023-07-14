import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import { deletePODetail } from '../../../../service/service';
import { toast } from "react-toastify";

const ModalDeletePODetail = (props) => {

    const { show, handleCloses, dataDeletePODetail, getProducts, currenPage } =
      props;
    const confirmDelete = async () => {
      let page;
      if (currenPage) {
        page = currenPage;
      } else {
        page = 0;
      }
      try {
        let res = await deletePODetail(dataDeletePODetail.poDetailId);
        console.log(res);
        if (res && res.statusCode === 200) {
          toast.success("Xóa thành công!!!");
          handleCloses();
          getProducts(page);
        } else {
          toast.error("Xóa không thành công!!");
          handleCloses();
        }
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi xóa người dùng!!");
        handleCloses();
      }
    };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        show={show}
        onHide={handleCloses}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete PO Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>Bạn có chắc muốn xóa không?</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloses}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDelete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
{/* 
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
      </div> */}
    </div>
  );
}

export default ModalDeletePODetail