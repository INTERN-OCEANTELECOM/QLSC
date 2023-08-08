import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import { deletePODetail } from '../../../../service/service';
import { toast } from "react-toastify";

const ModalDeletePODetail = (props) => {

    const { show, handleCloses, dataDeletePODetail } =
      props;
    const confirmDelete = () => {
      console.log(dataDeletePODetail);
      if (Array.isArray(dataDeletePODetail)) {
        const index = dataDeletePODetail.findIndex(
          (i) => i.poDetailId === item.poDetailId
        );
        if (index !== -1) {
          const newDataList = [...dataDeletePODetail];
          newDataList.splice(index, 1);
          localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
          setDataBarcode(newDataList);
        }
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
          <Modal.Title>Delete Barcode</Modal.Title>
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