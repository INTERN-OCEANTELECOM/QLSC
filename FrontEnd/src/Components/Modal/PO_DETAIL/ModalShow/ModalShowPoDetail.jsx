import React, { useEffect, useState } from "react";
import "./modalshowproduct.scss";
import { Modal, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import moment from "moment";

const ModalShowPoDetail = (props) => {

  const { show, handleCloses, dateShowPoDetail } = props;
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
  const [productName, setProductName] = useState("");
  const [prioritize, setPrioritize] = useState("")

  // check if show then get data po detail
  useEffect(() => {
    // convert date import and warranty, format date dd/mm/yy
    const time = dateShowPoDetail.importDate;
    const data = moment(time).format("DD/MM/YYYY");
    const timeExport = dateShowPoDetail.exportPartner
    const timeWarranty = dateShowPoDetail.warrantyPeriod;
    const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
    const dataExportPartner = moment(timeExport).format("DD/MM/YYYY")
    if (show) {
      setProductId(dateShowPoDetail.product.productId);
      setProductName(dateShowPoDetail.product.productName);
      setSerialNumber(dateShowPoDetail.serialNumber);
      setPo(dateShowPoDetail.po.poNumber);
      setBbbg(dateShowPoDetail.bbbgNumber);
      setImportDate(data);
      setRepairCategory(dateShowPoDetail.repairCategory);
      setRepairStatus(dateShowPoDetail.repairStatus);
      setExportPartner(dataExportPartner);
      setKcsVT(dateShowPoDetail.kcsVT);
      setWarrantyPeriod(dataWarranty);
      setPrioritize(dateShowPoDetail.priority);
      setBbbgPartner(dateShowPoDetail.bbbgNumberExport);
    }
  }, [dateShowPoDetail]);

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Po Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form className="input-po-detail">
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Mã hàng hóa</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      value={productId}
                      type="text"
                      placeholder="Mã hàng hóa"
                      onChange={(event) => setProductId(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Số serial hỏng</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Số serial hỏng"
                      value={serialNumber}
                      onChange={(event) => setSerialNumber(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationCustomUsername"
                  >
                    <Form.Label>Số PO</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Số PO"
                        required
                        readOnly
                        value={po}
                        onChange={(e) => setPo(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Tên thiết bị</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={productName}
                      readOnly
                      onChange={(event) => setProductName(event.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Ngày nhập kho</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Ngày nhập kho"
                      value={importDate}
                      onChange={(e) => setImportDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationCustomUsername"
                  >
                    <Form.Label>Hạng mục SC</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Hạng mục SC"
                        required
                        readOnly
                        value={
                          repairCategory === 0 ? "Nhập kho SC" : "Nhập kho BH"
                        }
                        onChange={(e) => setRepairCategory(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Ưu tiên SC</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Ưu tiên SC"
                      value={prioritize === 0 ? "Không ưu tiên" : "Ưu tiên"}
                      onChange={(e) => setPrioritize(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Cập nhật SC</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Cập nhật SC"
                      value={
                        repairStatus === 0
                          ? "Sửa chữa không được"
                          : repairStatus === 1
                          ? "Sửa chữa xong"
                          : repairStatus === 2
                          ? "Cháy nổ"
                          : "Trạng thái SC"
                      }
                      onChange={(e) => setRepairStatus(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Số BBXK</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Số BBXK"
                      value={bbbgPartner}
                      onChange={(e) => setBbbgPartner(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Cập nhật XK</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Cập nhật XK"
                      value={exportPartner}
                      onChange={(e) => setExportPartner(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Cập nhật KCS</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Cập nhật KCS"
                      value={kcsVT === 0 ? "FAIL" : "PASS"}
                      onChange={(e) => setKcsVT(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Cập nhật BH</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Cập nhật BH"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalShowPoDetail;
