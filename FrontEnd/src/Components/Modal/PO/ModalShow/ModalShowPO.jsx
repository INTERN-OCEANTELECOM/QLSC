import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

const ModalShowPO = (props) => {
  const { show, handleClose, dataPo } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [po, setPo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [contract, setContract] = useState("")
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateWarranty, setSelectedDateWarranty] = useState(null);

  // check if show modal then get the data passed
  useEffect(() => {
    if (show) {
      setContract(dataPo.contractNumber);
      setPo(dataPo.poNumber);
      setQuantity(dataPo.quantity);
      setSelectedDateStart(dataPo.beginAt);
      setSelectedDateEnd(dataPo.endAt);
      setSelectedDate(dataPo.contractWarrantyExpirationDate);
      setSelectedDateWarranty(dataPo.warrantyExpirationDate);
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

  // custom calender icon input
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
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputEmail1">Số hợp đồng</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Nhập số đồng"
                    value={contract}
                    readOnly
                    onChange={(event) => setContract(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputEmail1">Số PO</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Nhập số PO"
                    value={po}
                    readOnly
                    onChange={(event) => setPo(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword1">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Nhập số lượng"
                    value={quantity}
                    readOnly
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword3">Ngày bắt đầu</label>
                  <DatePicker
                    selected={selectedDateStart}
                    onChange={handleDateChangeStart}
                    dateFormat="dd/MM/yyyy"
                    readOnly
                    customInput={<CustomInput />}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword4">Ngày kết thúc</label>
                  <DatePicker
                    selected={selectedDateEnd}
                    onChange={handleDateChangeEnd}
                    dateFormat="dd/MM/yyyy"
                    readOnly
                    customInput={<CustomInput />}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword4">
                    Ngày hết hạn bảo lãnh THHĐ
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    dateFormat="dd/MM/yyyy"
                    readOnly
                    customInput={<CustomInput />}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword4">
                    Ngày hết hạn bảo lãnh bảo hành
                  </label>
                  <DatePicker
                    selected={selectedDateWarranty}
                    dateFormat="dd/MM/yyyy"
                    readOnly
                    customInput={<CustomInput />}
                  />
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalShowPO;
