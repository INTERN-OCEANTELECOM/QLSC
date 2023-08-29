import React, { useEffect, useState } from "react";
import "./modaladdproduct.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { addProduct, updateProduct } from "../../../../service/service";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { Col } from "react-bootstrap";

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
  const [imageData, setImageData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [deviceGroup, setDeviceGroup] = useState(null)

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
    if (!productId || !isAnyChecked || !deviceGroup) {
      setValidate("Cần điền đầy đủ thông tin");
      return;
    } else {
      setValidate("");
    }

    const mergedProductNames = productNames
      .map((nameObj, index) => {
        const label = nameObj.checked ? `${index + 1}*` : `${index + 1}`;
        return `${label}: ${nameObj.value}`;
      })
      .join("\n");

    const byteArray1 = convertToByteArray(imageData[0]);
    const byteArray2 = convertToByteArray(imageData[1]);
    const files = [
    ];
    // files.push(byteArray1, byteArray2);
    const imagesByteArrays = imageData.map(convertToByteArray);
    const imagesBase64 = imagesByteArrays.map(convertToBase64);

    let productGroup = {
      id : deviceGroup
    }

    // call api
    let res = await addProduct(
      productId,
      mergedProductNames,
      imagesBase64,
      productGroup
    );
    if (res && res.statusCode === 200) {
      setProductId("");
      setProductName("");
      setProductNames([{ value: "", checked: false }]);
      handleCloses();
      toast.success("Thêm thành công!!");
      getProducts(page);
      setDeviceGroup(null)
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
    setImageData([])
    setDeviceGroup(null);
  }

  const handleAddProductName = () => {
    if (productNames.length < 3) {
      setProductNames([...productNames, { value: "", checked: false }]);
    }
  };

  const handleImageSelect = (event, index) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    if (index === 1 && !imageData[0]) {
      // Nếu không chọn ảnh 1 mà chọn ảnh 2, lưu ảnh vào ảnh 1
      setImageFile(file);
      reader.onload = (e) => {
        const newImageData = [...imageData];
        newImageData[0] = e.target.result;
        setImageData(newImageData);
      };
    } else {
      // Ngược lại, lưu ảnh vào ô tương ứng
      setImageFile(file);
      reader.onload = (e) => {
        const newImageData = [...imageData];
        newImageData[index] = e.target.result;
        setImageData(newImageData);
      };
    }

    reader.readAsDataURL(file);
  };

  const convertToByteArray = (base64String) => {
    if (!base64String) {
      return new Uint8Array(0); // Return an empty byte array if base64String is undefined or empty
    }
    const binaryString = atob(base64String.split(",")[1]);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  };

  const convertToBase64 = (byteArray) => {
    let binary = "";
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
  };


  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex justify-content-between  form-product">
            <div className="form-input">
              <div className="validate-add-product">{validate}</div>
              <Form.Group
                as={Col}
                controlId="validationCustom03"
                className="mb-3"
              >
                <Form.Label>Nhóm thiết bị</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  // className="me-5"
                  value={deviceGroup === null ? "Tất cả" : deviceGroup}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDeviceGroup(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Chọn nhóm thiết bị</option>
                  <option value="PTTBVT">Card phụ trợ thiết bị vô tuyến</option>
                  <option value="XLCTBVT">
                    Card xử lí chính thiết bị vô tuyến
                  </option>
                  <option value="TBTDCĐBR">
                    Thiết bị truyền dẫn và CĐBR
                  </option>
                  <option value="TBCĐ">Thiết bị cơ điện</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
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
                    <Form.Check.Label>
                      Tên thiết bị {index + 1}
                    </Form.Check.Label>
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
                <Button
                  variant="primary"
                  onClick={handleAddProductName}
                  className="my-3"
                >
                  Thêm tên thiết bị +
                </Button>
              ) : null}
            </div>
            <div className="form-img">
              {/* Ô tải ảnh thứ nhất */}
              <Form.Group className="mb-3">
                <Form.Label>Tải ảnh 1:</Form.Label>
                <div
                  className="image-input"
                  onClick={() =>
                    document.getElementById(`image-input-${0}`).click()
                  }
                >
                  {imageData.length > 0 && imageData[0] ? (
                    <img
                      src={imageData[0]}
                      alt="Ảnh 1"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="image-placeholder">Chọn ảnh</div>
                  )}
                  <input
                    id={`image-input-${0}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageSelect(e, 0)}
                  />
                </div>
              </Form.Group>
              {/* Ô tải ảnh thứ hai */}
              <Form.Group className="mb-3">
                <Form.Label>Tải ảnh 2:</Form.Label>
                <div
                  className="image-input"
                  onClick={() =>
                    document.getElementById(`image-input-${1}`).click()
                  }
                >
                  {imageData.length > 0 && imageData[1] ? (
                    <img
                      src={imageData[1]}
                      alt="Ảnh 2"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="image-placeholder">Chọn ảnh</div>
                  )}
                  <input
                    id={`image-input-${1}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageSelect(e, 1)}
                  />
                </div>
              </Form.Group>
            </div>
            {/* 
            <Button variant="primary" onClick={handleSaveImages}>
              Lưu ảnh
            </Button> */}
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
