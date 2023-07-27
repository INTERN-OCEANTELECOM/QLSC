import React, { useState } from "react";
import { Modal, Button, Row, Form, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "./modeladdpo.scss";
import { toast } from "react-toastify";
import { createPo } from "../../../../service/service";

const ModelAddPO = (props) => {

  const { show, handleClose, getAllPo } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateWarranty, setSelectedDateWarranty] = useState(null);
  const [po, setPo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [contract, setContract] = useState("")
  const [note, setNote] = useState("")

  //handle change date start
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change date end
  const handleDateChangeEnd = (date) => {
    setSelectedDateEnd(date);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleDateChangeWarranty = (date) => {
    setSelectedDateWarranty(date);
  };

  // custom input icon calendar
  const CustomInput = ({ value, onClick }) => (
    <div className="custom-input">
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
      />
      <div className="icon-container" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" />
      </div>
    </div>
  );

  // handle add po
  const handleAddPO = async () => {
    // validate
    if (
      !contract ||
      !po ||
      !quantity 
    ) {
      setIsValidate("Cần nhập số hợp đồng, PO và số lượng");
      return
    } else {
      setIsValidate("");
    } 
    if (quantity <= 0) {
      setIsValidate("Số lượng phải lớn hơn 0");
      return
    }else {
      setIsValidate("");
    } 
    

    let time
    let timeWarrantyDate
    let timeStart
    let timeEnd
    if(selectedDate !== null) {
      time = selectedDate.getTime()
    }

    if(selectedDateWarranty !== null) {
      timeWarrantyDate = selectedDateWarranty.getTime();
    }

  if (selectedDateStart !== null) {
    timeStart = selectedDateStart.getTime()
  }

  if(selectedDateEnd !== null) {
    timeEnd = selectedDateEnd.getTime() 
  }

  if (timeStart && timeEnd && timeStart >= timeEnd) {
    setIsValidate("Ngày kết thúc phải sau ngày bắt đầu");
    return;
  } else {
    setIsValidate("");
  }

    let res = await createPo(
      contract,
      po,
      quantity,
      timeStart,
      timeEnd,
      time,
      timeWarrantyDate,
      note
    );

    // call api
    if (res && res.statusCode === 200) {
      toast.success("Thêm thành công!!");
      toast.warning("Bạn chỉ được phép chỉnh sửa số PO và hợp đồng trong 24h");
      setContract("")
      setPo("");
      setQuantity("");
      setSelectedDateEnd(null);
      setSelectedDateStart(null);
      setSelectedDate(null)
      setSelectedDateWarranty(null)
      getAllPo(0);
      handleClose();
    } else {
      if (
        res &&
        res.data.statusCode === 501
      ) {
        setIsValidate("PO đã tồn tại");
        
      } else {
        setIsValidate("")
        toast.error("Thêm không thành công!!!")
      }

    }
  };

  const handleCloses = () => {
    setIsValidate("");
    setContract("");
    setPo("");
    setQuantity("");
    setSelectedDateEnd(null);
    setSelectedDateStart(null);
    setSelectedDate(null);
    setSelectedDateWarranty(null);
    handleClose(); // Gọi hàm handleClose được truyền từ props
  };
  

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add new PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form className="input-po-detail">
                <Row className="mb-3 ">
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Nhập số hợp đồng</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputEmail9"
                      aria-describedby="emailHelp"
                      placeholder="Nhập số hợp đồng"
                      value={contract}
                      onChange={(event) => setContract(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Nhập số PO</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Nhập số PO"
                      value={po}
                      onChange={(event) => setPo(event.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group
                    as={Col}
                    md="12"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Nhập số lượng"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Ngày bắt đầu</Form.Label>
                    <DatePicker
                      selected={selectedDateStart}
                      onChange={handleDateChangeStart}
                      customInput={<Form.Control />}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Ngày kết thúc</Form.Label>
                    <DatePicker
                      selected={selectedDateEnd}
                      onChange={handleDateChangeEnd}
                      customInput={<Form.Control />}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea1999"
                  >
                    <Form.Label>Ngày hết hạn bảo lãnh THHĐ</Form.Label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      customInput={<Form.Control />}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea199"
                  >
                    <Form.Label>Ngày hết hạn bảo lãnh bảo hành</Form.Label>
                    <DatePicker
                      selected={selectedDateWarranty}
                      onChange={handleDateChangeWarranty}
                      customInput={<Form.Control />}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group controlId="exampleForm.ControlTextarea1">
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloses}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddPO}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModelAddPO;
