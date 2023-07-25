import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Form, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { updatePo } from "../../../../service/service";
import { toast } from "react-toastify";
import "./modalupdatepo.scss"

const ModalUpdatePo = (props) => {
  const {
    show,
    handleClose,
    dataPo,
    getAllPo,
    currentPage,
    handleSearch,
    search,
    currentPageSearch,
  } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateWarranty, setSelectedDateWarranty] = useState(null);
  const [po, setPo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [contractNumber, setContractNumber] = useState("")
  const [note, setNote] = useState("")

  // check if show then get data po
  useEffect(() => {
    if (show) {
      setPo(dataPo.poNumber);
      localStorage.setItem("po", dataPo.poNumber);
      setQuantity(dataPo.quantity);
      setSelectedDateStart(dataPo.beginAt);
      setSelectedDateEnd(dataPo.endAt);
      setContractNumber(dataPo.contractNumber)
      setSelectedDate(dataPo.contractWarrantyExpirationDate);
      setSelectedDateWarranty(dataPo.warrantyExpirationDate);
      setNote(dataPo.note);
      setIsValidate("")
    }
    
  }, [dataPo]);

  // handle change date start
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

  // custom icon calendar input
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input">
      <input
        ref={ref}
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        readOnly
      />
      <div className="icon-container" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" />
      </div>
    </div>
  ));

  // handle update po
  const handleUpdatePo = async () => {
    // if (selectedDateStart >= selectedDateEnd) {
    //   setIsValidate("Ngày kết thúc phải sau ngày bắt đầu");
    //   return;
    // } else {
    //   setIsValidate("");
    // }

    if(!contractNumber || !po) {
      setIsValidate("Số hợp đồng, số PO không được bỏ trống")
      return
    } else {
      setIsValidate("")
    }

    if (quantity <= 0) {
      setIsValidate("Số lượng phải lớn hơn 0");
      return;
    } else {
      setIsValidate("");
    } 

    let page;
    if (currentPage) {
      page = currentPage;
    } else {
      page = 0;
    }
    if (quantity <= 0) {
      setIsValidate("Số lượng phải lớn hơn 0");
      return;
    } else {
      setIsValidate("");
    }

    let endDate;
    let startDate;
    let date;
    let dateWarranty;
    if (selectedDateStart !== null) {
        startDate = new Date(selectedDateStart).getTime();
    }
    if (selectedDateEnd !== null) {
        endDate = new Date(selectedDateEnd).getTime();
    }
      if (selectedDate !== null) {
        date = new Date(selectedDate).getTime();
      }
    if (selectedDateWarranty !== null ) {
      dateWarranty = new Date(selectedDateWarranty).getTime();
    }
    
    if (startDate && endDate && startDate >=endDate) {
      setIsValidate("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    } else {
      setIsValidate("");
    }
      try {
        let res = await updatePo(
          contractNumber,
          po,
          quantity,
          startDate,
          endDate,
          date,
          dateWarranty,
          note
        );

        if (res && res.statusCode === 200) {
          handleClose();
          toast.success("Cập nhật thông tin thành công!!");
          localStorage.removeItem("po");
          
          if (search) {
            handleSearch(currentPageSearch);
          } else {
            getAllPo(page);
          }
        } else if (res && res.statusCode === 205) {
          if (
            res.statusMessage ===
            "YOU CAN ONLY UPDATE WITHIN THE FIRST 24 HOURS"
          ) {
            setIsValidate(
              "Bạn chỉ được phép chỉnh PO và số Hợp đồng trong 24h!!"
            );
          } else if (res.statusMessage === "NEW PO NUMBER ALREADY EXISTS") {
            setIsValidate("Số PO đã tồn tại");
            setPo(dataPo.poNumber);
          } else {
            setIsValidate("");
          }
        } else if (res && res.data.statusCode === 501) {
          setIsValidate("");
          handleClose();
          toast.error(
            "Cập nhật không thành công do đã import dữ liệu theo PO!!"
          );
          setPo(dataPo.poNumber);
        } else {
          setIsValidate("");
          handleClose();
          toast.error("Cập nhật không thành công!!");
        }
      } catch (error) {
        // Xử lý lỗi ở đây
        toast.error("Cập nhật không thành công!!!!");
        handleClose();
        console.error(error);
      }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form className="input-po-detail">
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Số hợp đồng</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputEmail9"
                      aria-describedby="emailHelp"
                      placeholder="Nhập số PO"
                      value={contractNumber}
                      onChange={(event) =>
                        setContractNumber(event.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Số PO</Form.Label>
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
                  <Form.Group as={Col} md="12">
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
                  <Form.Group as={Col} md="6">
                    <Form.Label>Ngày bắt đầu</Form.Label>
                    <DatePicker
                      selected={selectedDateStart}
                      onChange={handleDateChangeStart}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<Form.Control />}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Ngày kết thúc</Form.Label>
                    <DatePicker
                      selected={selectedDateEnd}
                      onChange={handleDateChangeEnd}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<Form.Control />}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Ngày hết hạn bảo lãnh THHĐ</Form.Label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<Form.Control />}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="exampleForm.ControlTextarea19999999"
                  >
                    <Form.Label>Ngày hết hạn bảo lãnh bảo hành</Form.Label>
                    <DatePicker
                      selected={selectedDateWarranty}
                      onChange={handleDateChangeWarranty}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<Form.Control />}
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdatePo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdatePo;
