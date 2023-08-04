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
  const [productNames, setProductNames] = useState([
    { value: "", checked: false },
  ]);
  const [selectedNameIndex, setSelectedNameIndex] = useState(0);


  // check if show then get data product
  useEffect(() => {
    if (show) {
      setProductId(dataDetail.productId);
      setProductName(dataDetail.productName);
      setValidate("")
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
    
    const isAnyChecked = productNames.some((nameObj) => nameObj.checked);
  if (!productId || !isAnyChecked) {
    setValidate("Cần điền đầy đủ thông tin");
    return;
  } else {
    setValidate("");
  }

    const mergedProductNames = productNames
      .map((nameObj, index) => {
        const label = nameObj.checked
          ? `${index + 1}*`
          : `${index + 1}`;
        return `${label}: ${nameObj.value}`;
      })
      .join("\n");  
    // call api
    let res = await addProduct(productId, mergedProductNames);
    if (res && res.statusCode === 200) {
      setProductId("");
      setProductName("");
      setProductNames([{ value: "", checked: false }]);
      handleCloses();
      toast.success("Thêm thành công!!");
      getProducts(page);
    } else {
      setValidate(res.data.data);
    }
  };

  const handleClose = () => {
    handleCloses()
    setValidate("")
    setProductId("");
    setProductNames([{ value: "", checked: false }]);
    setSelectedNameIndex(0)
  }

  const handleAddProductName = () => {
    if (productNames.length < 3) {
      setProductNames([...productNames, { value: "", checked: false }]);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose} backdrop="static">
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
            {productNames.map((nameObj, index) => (
              <div key={index}>
                <Form.Check>
                  <Form.Check.Input
                    type="radio"
                    name={`radio-name`}
                    checked={nameObj.checked}
                    onChange={() => {
                      const updatedNames = productNames.map((item, i) => ({
                        ...item,
                        checked: i === index,
                      }));
                      setProductNames(updatedNames);
                    }}
                  />
                  <Form.Check.Label>Tên thiết bị {index + 1}</Form.Check.Label>
                </Form.Check>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={nameObj.value}
                  onChange={(event) => {
                    const updatedNames = [...productNames];
                    updatedNames[index].value = event.target.value;
                    setProductNames(updatedNames);
                  }}
                />
              </div>
            ))}

            {productNames.length < 3 ? (
              <Button variant="primary" onClick={handleAddProductName} className="my-3">
                Thêm tên thiết bị +
              </Button>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
