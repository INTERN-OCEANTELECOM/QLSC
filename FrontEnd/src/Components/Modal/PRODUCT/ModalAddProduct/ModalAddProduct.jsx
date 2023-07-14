import React, { useEffect, useState } from "react";
import "./modaladdproduct.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { addProduct, updateProduct } from "../../../../service/service";
import { toast } from "react-toastify";

const ModalAddProduct = (props) => {
  const {
    show,
    handleCloses,
    dataDetail,
    getProducts,
    currentPage,
  } = props;
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [validate, setValidate] = useState("");

  // check if show then get data product
  useEffect(() => {
    if (show) {
      setProductId(dataDetail.productId);
      setProductName(dataDetail.productName);
    }
  }, [dataDetail]);

  // handle add product
  const handleAddProduct = async () => {
    let page;
    if (currentPage) {
      page = currentPage;
    } else {
      page = 0;
    }
    //validate 
    if (!productId || !productName) {
      setValidate("Cần điền đầy đủ thông tin");
    } else {
      setValidate("");
    }
    // call api
    let res = await addProduct(productId, productName);
    if (res && res.statusCode === 200) {
      setProductId("");
      setProductName("");
      handleCloses();
      toast.success("Thêm thành công!!");
      getProducts(page);
    } else {
      setValidate(res.data.data);
    }
  };
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="validate-add-product">{validate}</div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mã sản phẩm</Form.Label>
              <Form.Control
                type="email"
                placeholder="Mã sản phẩm"
                value={productId}
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
          <Button variant="secondary" onClick={handleCloses}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalAddProduct;
