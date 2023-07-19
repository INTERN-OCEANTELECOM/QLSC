import React, { useEffect, useState } from "react";
import "./modalshowproduct.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { updateProduct } from "../../../../service/service";
import { toast } from "react-toastify";

const ModalShowProduct = (props) => {
  const {
    show,
    handleClose,
    dataDetail,
    getProducts,
    currentPage,
    handleSearch,
    search
  } = props;
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");

  // check if show then get data product
  useEffect(() => {
    if (show) {
      setProductId(dataDetail.productId);
      setProductName(dataDetail.productName);
    }
  }, [dataDetail]);

  // handle update product
  const handleUpdateProduct = async () => {
    let page
    if(currentPage) {
      page= currentPage
    } else {
      page = 0
    }
    let res = await updateProduct(productId, productName);
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thành công!!!");
      
      if(search) {
        handleSearch(page);
      } else {
        getProducts(page);
      }
    } else {
      toast.error("Cập nhật không thành công!!");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mã sản phẩm</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={productId}
                readOnly
                disabled
                onChange={(event) => setProductId(event.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Tên thiết bị</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {localStorage.getItem("role") === "ROLE_MANAGER" ||
          localStorage.getItem("role") === "ROLE_ADMIN" ? (
            <Button variant="primary" onClick={handleUpdateProduct}>
              Save Changes
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalShowProduct;
