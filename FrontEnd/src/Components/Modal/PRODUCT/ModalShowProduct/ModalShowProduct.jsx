import React, { useEffect, useState } from "react";
import "./modalshowproduct.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { getImages, updateProduct } from "../../../../service/service";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import { Col } from "react-bootstrap";

const ModalShowProduct = (props) => {
  const {
    show,
    handleClose,
    dataDetail,
    getProducts,
    currentPage,
    handleSearch,
    search,
    currentPageSearch,
  } = props;
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productNames, setProductNames] = useState([
    { value: "", checked: false },
  ]);
  const [selectedNameIndex, setSelectedNameIndex] = useState(-1);
  const [validate, setValidate] = useState("");
  const [imageData1, setImageData1] = useState([]);
  const [imageData2, setImageData2] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [deviceGroup, setDeviceGroup] = useState(null)


  useEffect(() => {
    getImage();
  }, [productId]);

  useEffect(() => {
    if (show) {
      setValidate("")
      setProductId(dataDetail.productId);
      if (dataDetail.productGroup !== null) {
        setDeviceGroup(dataDetail.productGroup.id);
      }
      console.log(dataDetail.productGroup);
      // Tách dữ liệu thành mảng các tên thiết bị
      const names = dataDetail.productName.split("\n").map((name) => {
        const trimmedName = name.trim();
        const checked = trimmedName.includes("*"); // Kiểm tra dấu *
        const value = checked
          ? trimmedName.replace(/^\d+\s*\*?:/, "").trim()
          : trimmedName.replace(/^\d+\s*\*?:/, "").trim();
        return {
          value: value,
          checked: checked,
        };
      });

      // Nếu không có phần tử nào có dấu * thì đánh dấu ô radio đầu tiên là true
      const anyChecked = names.some((name) => name.checked);
      if (!anyChecked) {
        names[0].checked = true;
      }
      setProductNames(names);   
    }
  }, [dataDetail, show]);
  

  const getImage = async () => {
    let res = await getImages(productId);
    console.log(res.data.productGroup.groupName);
    if (res && res.statusCode === 200) {
      setImageData1(res.data.images[0].fileBytes);
      setImageData2(res.data.images[1].fileBytes);
      imageData.push(imageData1, imageData2)
      // setDeviceGroup(res.data.productGroup.groupName)
    }
  };

  const handleNameChange = (event, index) => {
    const { value } = event.target;
    const updatedNames = [...productNames];
    updatedNames[index].value = value;

    if (value.trim() === "" && updatedNames[index].checked) {
      // Nếu ô input rỗng và đang được chọn, tìm ô radio kế tiếp chưa được chọn và chọn nó
      let nextUncheckedIndex = -1;
      for (let i = index + 1; i < updatedNames.length; i++) {
        if (!updatedNames[i].checked) {
          nextUncheckedIndex = i;
          break;
        }
      }

      if (nextUncheckedIndex !== -1) {
        // Nếu có ô radio phía dưới chưa được chọn, chọn ô đó
        updatedNames[nextUncheckedIndex].checked = true;
      } else {
        // Nếu không có ô radio phía dưới chưa được chọn, chọn ô radio của ô trước đó
        for (let i = index - 1; i >= 0; i--) {
          if (!updatedNames[i].checked) {
            updatedNames[i].checked = true;
            break;
          }
        }
      }
    }

    setProductNames(updatedNames);
  };

  const handleRadioChange = (index) => {
    setSelectedNameIndex(index);
    setProductNames((prevNames) =>
      prevNames.map((nameObj, i) =>
        i === index
          ? { ...nameObj, checked: true }
          : { ...nameObj, checked: false }
      )
    );
  };

  const handleAddProductName = () => {
    if (productNames.length < 3) {
      setProductNames([...productNames, { value: "", checked: false }]);
    }
  };

  // handle update product
  const handleUpdateProduct = async () => {
    let page
    if(currentPage) {
      page= currentPage
    } else {
      page = 0
    }
   const mergedProductNames = productNames
     .filter((nameObj) => nameObj.value.trim() !== "") // Loại bỏ các giá trị rỗng
     .map((nameObj, index) => {
       const label = nameObj.checked ? `${index + 1}*` : `${index + 1}`;
       return `${label}: ${nameObj.value}`;
     })
     .join("\n");

     if(mergedProductNames === "") {
      setValidate("Cần phải có ít nhất 1 tên sản phẩm");
      return
     }

     let image = []
     let imagesByteArrays
     let imagesBase64 =[]
    //  if(imageData[0]) {
    //   image.push(imageData[0]);
    //  } else if (imageData[1]) {
    //   image.push(imageData[1]);
    //  } else 
     if (
       imageData[0] &&
       imageData2 &&
       imageData[0].length > 0 &&
       imageData2.length > 0
     ) {
       console.log("aaaa1");
       image.push(imageData[0]);
       imagesByteArrays = image.map(convertToByteArray);
       imagesBase64 = imagesByteArrays.map(convertToBase64);
       imagesBase64.unshift(imageData2);
     } else if (
       imageData1 &&
       imageData[1] &&
       imageData[1].length > 0 &&
       imageData1.length > 0
     ) {
       console.log("aaaa2");
       image.push(imageData[1]);
       imagesByteArrays = image.map(convertToByteArray);
       imagesBase64 = imagesByteArrays.map(convertToBase64);
       imagesBase64.push(imageData1);
     } else if (
       imageData[0] &&
       imageData[1] &&
       imageData[0].length > 0 &&
       imageData[1].length > 0
     ) {
       console.log("aaaa3");
       image.push(imageData[0], imageData[1]);
       imagesByteArrays = image.map(convertToByteArray);
       imagesBase64 = imagesByteArrays.map(convertToBase64);
     } else if (imageData[0] && imageData[0].length > 0) {
       image.push(imageData[0]);
       imagesByteArrays = image.map(convertToByteArray);
       imagesBase64 = imagesByteArrays.map(convertToBase64);
     } else if (imageData[1] && imageData[1].length > 0) {
       console.log("aaaa4");
       image.push(imageData[1]);
       imagesByteArrays = image.map(convertToByteArray);
       imagesBase64 = imagesByteArrays.map(convertToBase64);
     } else if (
       imageData1 &&
       imageData2 &&
       imageData1.length > 0 &&
       imageData2.length > 0
     ) {
       console.log("aaaa5");
       imagesBase64.push(imageData1, imageData2);
     } else if (imageData1 && imageData1.length > 0) {
       console.log("aaaa6");
       imagesBase64.push(imageData1);
     }
     
     let productGroup = {
      id : deviceGroup
     }

    let res = await updateProduct(
      productId,
      mergedProductNames,
      imagesBase64,
      productGroup
    );
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thành công!!!");
      setImageData([])
      setImageData1([])
      setImageData2([])
      setDeviceGroup(null)
      getImage()
      if(search) {
        handleSearch(currentPageSearch);
      } else {
        getProducts(page);
      }
    } else {
      toast.error("Cập nhật không thành công!!");
    }
  };

  const handleImageSelect = async (event, index) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    console.log(file);
    reader.onload = (e) => {
      const newImageData = [...imageData];
      newImageData[index] = e.target.result;

      // Nếu ảnh từ API đã tồn tại, đặt giá trị tạm thời là null
      if (index === 0 && imageData1 && imageData1.length > 0) {
        setImageData1(null);
      } else if (index === 1 && imageData2 && imageData2.length > 0) {
        setImageData2(null);
      }

      setImageData(newImageData);
    };

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

  const handleCloses = () => {
    handleClose()
    setImageData1([]);
    setImageData2([])
    setImageData([])
    setProductId("")
    setProductName("")
    setDeviceGroup(null);

  }

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
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
                  value={
                    deviceGroup === null ? "Chọn nhóm thiết bị" : deviceGroup
                  }
                  onChange={(event) => {
                    const value = event.target.value;
                    setDeviceGroup(
                      value === "Chọn nhóm thiết bị" ? null : value
                    );
                  }}
                >
                  <option value={null}>Chọn nhóm thiết bị</option>
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
                  type="text"
                  value={productId}
                  readOnly
                  disabled
                  onChange={(event) => setProductId(event.target.value)}
                />
              </Form.Group>
              {productNames.map((nameObj, index) => (
                <div key={index}>
                  <Form.Check>
                    <Form.Check.Input
                      type="radio"
                      name={`radio-name`}
                      id={`radio-${index}`}
                      checked={nameObj.checked}
                      onChange={() => handleRadioChange(index)}
                    />
                    <Form.Check.Label htmlFor={`radio-${index}`}>
                      Tên thiết bị {index + 1}
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={nameObj.value}
                    onChange={(event) => handleNameChange(event, index)}
                  />
                </div>
              ))}

              {productNames.length < 3 ? (
                <Button
                  variant="secondary"
                  onClick={handleAddProductName}
                  className="my-3"
                >
                  Thêm tên thiết bị +
                </Button>
              ) : null}
            </div>

            <div className="form-img">
              {/* Ô tải ảnh thứ nhất */}
              {/* <Form.Group className="mb-3">
                {imageData.map((image, index) => (
                  <div
                    className="image-input mb-2"
                    onClick={() =>
                      document.getElementById("image-input-1").click()
                    }
                  >
                    <>
                      <img
                        key={index}
                        src={`data:image/jpeg;base64,${image.fileBytes}`}
                        alt={`Hình ảnh ${index + 1}`}
                        style={{ width: "100%", height: "100%" }}
                      />

                      <input
                        id="image-input-1"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageSelect}
                      />
                    </>
                  </div>
                ))}
              </Form.Group> */}
              <Form.Group className="mb-3">
                <Form.Label>Ảnh 1:</Form.Label>
                <div
                  className="image-input"
                  onClick={() =>
                    document.getElementById("image-input-1").click()
                  }
                >
                  {imageData1 && imageData1.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${imageData1}`}
                      alt="Ảnh 1"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : imageData && imageData.length > 0 && imageData[0] ? (
                    <img
                      src={imageData[0]}
                      alt="Ảnh"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="image-placeholder">Chọn ảnh</div>
                  )}
                  <input
                    id="image-input-1"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageSelect(e, 0)}
                  />
                </div>
              </Form.Group>

              {/* Ô tải ảnh thứ hai */}
              <Form.Group className="mb-3">
                <Form.Label>Ảnh 2:</Form.Label>
                <div
                  className="image-input"
                  onClick={() =>
                    document.getElementById("image-input-2").click()
                  }
                >
                  {imageData2 && imageData2.length > 0 ? (
                    <img
                      src={`data:image/jpeg;base64,${imageData2}`}
                      alt="Ảnh 2"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : imageData && imageData.length > 0 && imageData[1] ? (
                    <img
                      src={imageData[1]}
                      alt="Ảnh"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="image-placeholder">Chọn ảnh</div>
                  )}
                  <input
                    id="image-input-2"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageSelect(e, 1)}
                  />
                </div>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloses}>
            Close
          </Button>
          {localStorage.getItem("role") === "ROLE_MANAGER" ||
          localStorage.getItem("role") === "ROLE_ADMIN" ||
          localStorage.getItem("role") === "ROLE_QLPO" ? (
            <>
              <Button variant="primary" onClick={handleUpdateProduct}>
                Save Changes
              </Button>
            </>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalShowProduct;
