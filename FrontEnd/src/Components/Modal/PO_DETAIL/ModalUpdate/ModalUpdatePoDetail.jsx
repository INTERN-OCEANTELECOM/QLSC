import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import "./modalupdatepodetail.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { deletePODetail, getImages, updatePoDetail } from "../../../../service/service";
import { toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import moment from "moment";

const ModalUpdatePoDetail = (props) => {

  const {
    show,
    handleCloses,
    dateEditPoDetail,
    getProducts,
    currenPage,
    handleSearch,
    currentPageSearch,
    productIds,
    serialNumbers,
    value1s,
    bbbgs,
    selectedDateStarts,
    repairCategorys,
    repairStatuss,
    exportPartners,
    kcsVts,
    prioritys,
    items,
    searchByPO,
    datae,
  } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateWarrity, setSelectedDateWarrity] = useState(null);
  const [selectedDateExportPartner, setSelectedDateExportPartner] =
    useState(null);
  const [po, setPo] = useState("");
  const [productId, setProductId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [bbbg, setBbbg] = useState("");
  const [bbbgPartner, setBbbgPartner] = useState("");
  const [importDate, setImportDate] = useState("");
  const [repairCategory, setRepairCategory] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [exportPartner, setExportPartner] = useState("");
  const [kcsVT, setKcsVT] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [poDetailId, setPoDetailId] = useState("");
  const [prioritize, setPrioritize] = useState("")
  const [note, setNote] = useState("")
  const [productName, setProductName] = useState("")
  const [imageData1, setImageData1] = useState([]);
  const [imageData2, setImageData2] = useState([]);

  useEffect(() => {
    getImage();
  }, [show, productId]);

  // check if show then get data po detail
  useEffect(() => {
    // convert date import and warranty, format date dd/mm/yy
    const time = dateEditPoDetail.importDate;
    const data = moment(time).format("DD/MM/YYYY");
    const timeWarranty = dateEditPoDetail.warrantyPeriod;
    const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
    if (show) {
      setPoDetailId(dateEditPoDetail.poDetailId);
      setProductId(dateEditPoDetail.product.productId);
      setProductName(dateEditPoDetail.product.productName);
      setSerialNumber(dateEditPoDetail.serialNumber);
      setPo(dateEditPoDetail.po.poNumber);
      setBbbg(dateEditPoDetail.bbbgNumber);
      setSelectedDateStart(dateEditPoDetail.importDate);
      if (dateEditPoDetail.importDate === null) {
        setRepairCategory(-1);
      } else {
        setRepairCategory(dateEditPoDetail.repairCategory);
      }

      if (dateEditPoDetail.repairStatus === null) {
        setRepairStatus(-1)
      }else {
        setRepairStatus(dateEditPoDetail.repairStatus);
      }

      if (dateEditPoDetail.kcsVT === null) {
        setKcsVT(-1);
      } else {
        setKcsVT(dateEditPoDetail.kcsVT);
      }

      if (dateEditPoDetail.priority === null) {
        setPrioritize(-1);
      } else {
        setPrioritize(dateEditPoDetail.priority);
      }
      setExportPartner(dateEditPoDetail.exportPartner);
      setSelectedDateExportPartner(dateEditPoDetail.exportPartner);
      setWarrantyPeriod(dataWarranty);
      setSelectedDateWarrity(dateEditPoDetail.warrantyPeriod);
      setBbbgPartner(dateEditPoDetail.bbbgNumberExport);
      setNote(dateEditPoDetail.note);

    }
  }, [dateEditPoDetail, datae]);



  
  const getImage = async () => {
    let res = await getImages(productId);
    console.log(res);
    if (res && res.statusCode === 200) {
      setImageData1(res.data.images[0].fileBytes);
      setImageData2(res.data.images[1].fileBytes);
    }
  };

  // handle change state date
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change end date
  const handleDateChangeWarranty = (date) => {
    setSelectedDateWarrity(date);
  };

  const handleDateChangeExportPartner = (date) => {
    setSelectedDateExportPartner(date);
  };


  // handle update po detail
  const handleUpdatePoDetail = async () => {
    let page;
    if (currenPage) {
      page = currenPage;
    } else {
      page = 0;
    }
    // convert date warranty and start date to long
    let WarrantyDate
    let startDate;
    let exportDate;
    if(selectedDateWarrity !== null) {
        WarrantyDate = new Date(selectedDateWarrity).getTime();
    } else {
      WarrantyDate = selectedDateWarrity;
    }
    if(selectedDateStart !== null) {
      startDate = new Date(selectedDateStart).getTime();
    } else {
      startDate = selectedDateStart;
    }
    if (selectedDateExportPartner !== null) {
      exportDate = new Date(selectedDateExportPartner).getTime();
    } else {
      exportDate = selectedDateExportPartner;
    }
    // call api update po detail
    let res = await updatePoDetail(
      poDetailId,
      bbbg,
      startDate,
      repairCategory,
      prioritize,
      repairStatus,
      exportDate,
      kcsVT,
      WarrantyDate,
      bbbgPartner,
      note
    );
    if (res && res.statusCode === 200) {
      toast.success("Cập nhật thành công !!!");
      if (
        currentPageSearch ||
        productIds ||
        serialNumbers ||
        value1s ||
        items ||
        bbbgs ||
        selectedDateStarts ||
        repairCategorys ||
        repairStatuss ||
        exportPartners ||
        kcsVts ||
        prioritys
      ) {
        if(items) {
          searchByPO(currentPageSearch)
        }else {
          handleSearch(currentPageSearch);
        }
      } else {
        getProducts(page);
      } 
      handleCloses();
      setBbbgPartner(null)
      setRepairCategory(null)
      setPrioritize(null)
      setRepairStatus(null)
      setKcsVT(null)
      setNote(null)
    } else {
      toast.error("Cập nhật thất bại !!!");
    }
  };

  const confirmDelete = async () => {
    let page;
    if (currenPage) {
      page = currenPage;
    } else {
      page = 0;
    }
    try {
      let res = await deletePODetail(dateEditPoDetail.poDetailId);
      console.log(res);
      if (res && res.statusCode === 200) {
        toast.success("Xóa thành công!!!");
        handleCloses();
        getProducts(page);
      } else {
        if (res && res.statusCode === 501) {
          toast.error("Xóa không thành công do đã tồn tại ở QLSC!!");
          handleCloses();
        } else {
          toast.error("Xóa không thành công!!");
          handleCloses();
        }
        
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi xóa người dùng!!");
      handleCloses();
    }
  };

  const handleClose = () => {
    handleCloses();
    setImageData1([]);
    setImageData2([]);
    setProductId("")
  };



  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Po Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form className="input-po-detail">
                <div className="d-flex justify-content-between align-items-center ">
                  <div>
                    <Row className="mb-2 ">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom01"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom01"
                        >
                          Mã hàng hóa
                        </label>
                        <Form.Control
                          required
                          readOnly
                          disabled
                          value={productId}
                          type="text"
                          placeholder="Mã hàng hóa"
                          onChange={(event) => setProductId(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom02"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom02"
                        >
                          Số serial
                        </label>
                        <Form.Control
                          required
                          readOnly
                          disabled
                          type="text"
                          placeholder="Số serial hỏng"
                          value={serialNumber}
                          onChange={(event) =>
                            setSerialNumber(event.target.value)
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustomUsername1"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustomUsername1"
                        >
                          Số PO
                        </label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Số PO"
                            required
                            disabled
                            readOnly
                            value={po}
                            onChange={(e) => setPo(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                    <Row className=" mb-2">
                      <Form.Group
                        as={Col}
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <label
                          className="form-label-update"
                          for="exampleForm.ControlTextarea1"
                        >
                          Tên thiết bị
                        </label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={productName}
                          readOnly
                          disabled
                          // onChange={(event) => setProductName(event.target.value)}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-2 ">
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustom04"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom04"
                        >
                          Ngày nhập kho
                        </label>
                        <DatePicker
                          selected={selectedDateStart}
                          onChange={handleDateChangeStart}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          showMonthDropdown
                          customInput={<Form.Control />}
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="6"
                        controlId="validationCustomUsername2"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustomUsername2"
                        >
                          Hạng mục SC
                        </label>
                        <Form.Select
                          aria-label="Default select example"
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                          value={repairCategory}
                          onChange={(event) => {
                            const value = event.target.value;
                            setRepairCategory(
                              value === "Chưa cập nhật" ? "-1" : value
                            );
                          }}
                        >
                          <option value="-1">Chưa cập nhật</option>
                          <option value="0">Hàng SC</option>
                          <option value="1">Hàng BH</option>
                        </Form.Select>
                      </Form.Group>
                    </Row>
                    <Row className="mb-2 ">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom099"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom099"
                        >
                          Ưu tiên SC
                        </label>
                        <Form.Select
                          aria-label="Default select example111"
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                          value={prioritize}
                          onChange={(event) => {
                            const value = event.target.value;
                            setPrioritize(
                              value === "Chưa cập nhật" ? "-1" : value
                            );
                          }}
                        >
                          <option value="-1">Chưa cập nhật</option>
                          <option value="0">Không ưu tiên</option>
                          <option value="1">Ưu tiên</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom05"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom05"
                        >
                          Cập nhật SC
                        </label>
                        <Form.Select
                          aria-label="Default select example"
                          value={repairStatus}
                          onChange={(event) => {
                            const value = event.target.value;
                            setRepairStatus(
                              value === "Chưa cập nhật" ? "-1" : value
                            );
                          }}
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLSC" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                        >
                          <option value="-1">Chưa cập nhật</option>
                          <option value="0">Trả hỏng</option>
                          <option value="1">SC OK</option>
                          <option value="2">Cháy nổ</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom03"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom03"
                        >
                          Số BBXK
                        </label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Số BBXK"
                          value={bbbgPartner}
                          onChange={(e) => setBbbgPartner(e.target.value)}
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-2 ">
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom06"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom06"
                        >
                          Cập nhật XK
                        </label>
                        <DatePicker
                          selected={selectedDateExportPartner}
                          onChange={handleDateChangeExportPartner}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          showMonthDropdown
                          customInput={<Form.Control />}
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom07"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom07"
                        >
                          Cập nhật KCS
                        </label>
                        <Form.Select
                          aria-label="Default select example1"
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !==
                              "ROLE_KCSANALYST" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                          value={kcsVT}
                          onChange={(event) => {
                            const value = event.target.value;
                            setKcsVT(value === "Chưa cập nhật" ? "-1" : value);
                          }}
                        >
                          <option value="-1">Chưa cập nhật</option>
                          <option value="0">FAIL</option>
                          <option value="1">PASS</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationCustom08"
                      >
                        <label
                          className="form-label-update"
                          for="validationCustom08"
                        >
                          Cập nhật BH
                        </label>
                        <DatePicker
                          selected={selectedDateWarrity}
                          onChange={handleDateChangeWarranty}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          showMonthDropdown
                          customInput={<Form.Control />}
                          disabled={
                            localStorage.getItem("role") !== "ROLE_ADMIN" &&
                            localStorage.getItem("role") !== "ROLE_MANAGER" &&
                            localStorage.getItem("role") !== "ROLE_QLPO"
                          }
                        />
                      </Form.Group>
                    </Row>
                  </div>
                  <div className="ms-3">
                    <div className="image-container mb-2">
                      <img
                        src={`data:image/jpeg;base64,${imageData1}`}
                        alt="Ảnh thiết bị 1"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <div className="image-container ">
                      <img
                        src={`data:image/jpeg;base64,${imageData2}`}
                        alt="Ảnh thiết bị 2"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </div>
                </div>
                <Row className="mb-1 ">
                  <Form.Group
                    className="mb-3"
                    md="4"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={note === null ? "" : note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  </Form.Group>
                </Row>
              </form>
            </div>
          </div>
          <div className="d-flex justify-content-end ">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              className="mx-2"
              onClick={handleUpdatePoDetail}
            >
              Save Changes
            </Button>
            {localStorage.getItem("role") === "ROLE_ADMIN" ||
            localStorage.getItem("role") === "ROLE_MANAGER" ? (
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalUpdatePoDetail;
