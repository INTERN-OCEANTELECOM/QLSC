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

  useEffect(() => {
    if (show) {
      setValidate("")
      setProductId(dataDetail.productId);
      console.log(dataDetail.productName);

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
    let res = await updateProduct(productId, mergedProductNames);
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thành công!!!");
      
      if(search) {
        handleSearch(currentPageSearch);
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
          </Form>
          {productNames.length < 3 ? (
            <Button
              variant="secondary"
              onClick={handleAddProductName}
              className="my-3"
            >
              Thêm tên thiết bị +
            </Button>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {localStorage.getItem("role") === "ROLE_MANAGER" ||
          localStorage.getItem("role") === "ROLE_ADMIN" ? (
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
