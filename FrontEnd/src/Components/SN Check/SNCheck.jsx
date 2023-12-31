import React, { useEffect, useState } from "react";
import "./sncheck.scss";
import Table from "react-bootstrap/Table";
import { BiReset } from "react-icons/bi";
import { FaFileImport } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import { searchSerialNumber } from "../../service/service";
import { toast } from "react-toastify";
import { Button, Modal, Spinner } from "react-bootstrap";
import { read, utils, writeFile } from "xlsx";
import moment from "moment";

const SNCheck = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listPoDetailSN, setListPoDetailSN] = useState([]);
  const [isShowNotify, setIsShowNotify] = useState("");
  const [dataError, setDataError] = useState("");

    const handleExportSN = () => {
      let selectedColumns = [
        "Tên thiết bị",
        "Mã hàng hóa (*)",
        "Số serial (*)",
        "Số PO (*)",
        "Ngày nhập kho",
        "Hạng mục SC",
        "Ưu Tiên SC",
        "Cập nhật SC",
        "Số BBXK",
        "Cập nhật KCS",
        "Cập nhật BH",
        "Ghi chú",
      ];

      const exportData = [
        selectedColumns,
        ...listPoDetailSN.map((item, index) => {
          return [
            // index + 1,
            ...selectedColumns.slice(0).map((column) => {
              if (column === "Tên thiết bị") {
                const formattedProductName = formatProductName(
                  item.product.productName
                );
                return formattedProductName;
              }
              if (column === "Mã hàng hóa (*)") {
                return item.product.productId;
              }
              if (column === "Số serial (*)") {
                return item.serialNumber;
              }
              if (column === "Số PO (*)") {
                return item.po.poNumber;
              }
              if (column === "Ngày nhập kho") {
                if (item.importDate) {
                  return moment(item.importDate).format("DD/MM/YYYY");
                }
              }
              if (column === "Hạng mục SC") {
                if (item.repairCategory === 0) {
                  return "Hàng SC";
                } else if (item.repairCategory === 1) {
                  return "Hàng BH";
                }
              }
              if (column === "Ưu Tiên SC") {
                if (item.priority === 0) {
                  return;
                } else if (item.priority === 1) {
                  return "Ưu tiên SC";
                }
              }
              if (column === "Cập nhật SC") {
                if (item.repairStatus === 1) {
                  return "SC OK";
                } else if (item.repairStatus === 0) {
                  return "Trả hỏng";
                } else if (item.repairStatus === 2) {
                  return "Cháy nổ";
                }
              }
              if (column === "Số BBXK") {
                return item.bbbgNumberExport;
              }
              if (column === "Cập nhật XK") {
                if (item.exportPartner) {
                  return moment(item.exportPartner).format("DD/MM/YYYY");
                }
              }
              if (column === "Cập nhật KCS") {
                if (item.kcsVT === 0) {
                  return "FAIL";
                } else if (item.kcsVT === 1) {
                  return "PASS";
                }
              }
              if (column === "Cập nhật BH") {
                if (item.warrantyPeriod) {
                  return moment(item.warrantyPeriod).format("DD/MM/YYYY");
                }
              }
              if (column === "Ghi chú") {
                return item.note;
              }
            }),
          ];
        }),
      ];

      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet(exportData);
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      writeFile(workbook, "serial_check.xlsx");
    };

    useEffect(() => {
      const dataList = localStorage.getItem("dataList");
      if (dataList) {
        setListPoDetailSN(JSON.parse(dataList));
      }
    }, [localStorage.getItem("dataList")]);

    // import sn check
    const handleImportSN = async (event) => {
      try {
        const file = event.target.files[0];
        if (
          file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          toast.error("Vui lòng chỉ chọn tệp tin định dạng .xlsx!");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        setIsLoading(true);
        let response = await searchSerialNumber(formData);
        if (response && response.statusCode === 200) {
          toast.success("Dữ liệu đã được tải thành công!!");
          localStorage.setItem("dataList", JSON.stringify(response.data));
        } else {
          if (response && response.statusCode === 205) {
            setIsShowNotify(true);
            setData(response.data);
            toast.error("Dữ liệu được tải không thành công!!");
          }
        }
      } catch (error) {
        console.log(error)
        toast.error("Dữ liệu đã được tải không thành công!");
      } finally {
        setIsLoading(false);
        event.target.value = null; // Reset giá trị của input file
      }
    };

  const handleReset = () => {
    setListPoDetailSN("");
    localStorage.removeItem("dataList");
  };

  const handleCloses = () => {
    setIsShowNotify(false);
  };

   const formatProductName = (name) => {
     if (name === null) {
       return name;
     } else {
       const parts = name.split("\n");
       for (const part of parts) {
         const trimmedPart = part.trim();
         const asteriskIndex = trimmedPart.indexOf("*");
         const colonIndex = trimmedPart.indexOf(":");
         if (asteriskIndex !== -1) {
           const startIndex = Math.max(asteriskIndex + 1, colonIndex + 1);
           return trimmedPart.substring(startIndex).trim();
         }
       }
       return name;
     }
   };

  return (
    <div className="sn-check">
      <div className="btn-sncheck">
        <button
          className="btn btn-primary btn-reset"
          onClick={() => handleReset()}
        >
          <BiReset className="reset-icon" />
          Reset
        </button>
        <div className="import">
          <label htmlFor="test" className="btn btn-danger label-import mx-2">
            <FaFileImport className="import-icon" />
            Import S/N
          </label>
          <input type="file" onChange={handleImportSN} id="test" hidden />
        </div>
        <button
          className="btn btn-success btn-reset "
          onClick={() => handleExportSN()}
        >
          <FaFileExport className="reset-icon" />
          Export
        </button>
      </div>
      <div className="table-sn-check ">
        <Table striped bordered hover size="sm">
          <thead>
            <tr className="table-header">
              <th>Stt</th>
              <th>Mã hàng hóa (*)</th>
              <th>Tên thiết bị</th>
              <th>Số serial (*)</th>
              <th>Số PO (*)</th>
              <th>Ngày nhập kho</th>
              <th>Hạng mục SC</th>
              <th>Ưu tiên SC</th>
              <th>Cập nhật SC</th>
              <th>Số BBXK</th>
              <th>Cập nhật XK</th>
              <th>Cập nhật KCS</th>
              <th>Cập nhật BH</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {listPoDetailSN &&
              listPoDetailSN.length > 0 &&
              listPoDetailSN.map((item, index) => {
                // background color when priority is equal to 1
                const rowStyles = {
                  backgroundColor: "#ffeeba", // Màu nền sáng
                };
                // convert this from long to date
                const timeExport = item.exportPartner;
                // const currentIndex = startIndex + index;
                const time = item.importDate;
                const timeWarranty = item.warrantyPeriod;
                let dataWarranty;
                if (timeWarranty !== null) {
                  dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
                }
                let data;
                if (time !== null) {
                  data = moment(time).format("DD/MM/YYYY");
                }
                let dataExportPartner;
                if (timeExport !== null) {
                  dataExportPartner = moment(timeExport).format("DD/MM/YYYY");
                }
                // check if priority === 1 then change color
                const rowStyle =
                  item.priority === 1
                    ? rowStyles
                    : { backgroundColor: "#ffffff" };

                const formattedProductName = formatProductName(
                  item.product.productName
                );
                return (
                  <tr
                    key={`sc-${index}`}
                    // onDoubleClick={() => handleEditPoDetail(item)}
                    style={rowStyle}
                    className="table-striped"
                  >
                    <td>{index + 1}</td>
                    <td>{item.product.productId}</td>
                    <td className="col-name-product">{formattedProductName}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Hàng SC"}
                      {item.repairCategory === 1 && "Hàng BH"}
                    </td>
                    <td>{item.priority === 1 && "Ưu tiên"}</td>
                    <td>
                      {item.repairStatus === 0 && "Trả hỏng"}
                      {item.repairStatus === 1 && "SC OK"}
                      {item.repairStatus === 2 && "Cháy nổ"}
                    </td>
                    <td className="col-bbxk">{item.bbbgNumberExport}</td>
                    <td>{dataExportPartner}</td>
                    <td>
                      {item.kcsVT === 0 && "FAIL"}
                      {item.kcsVT === 1 && "PASS"}
                    </td>
                    <td>{dataWarranty}</td>
                    <td className="col-note">{item.note}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span className="loading">Đang tải...</span>
          </div>
        </div>
      )}

      <div
        className="modal show "
        style={{ display: "block", position: "initial" }}
      >
        <Modal
          show={isShowNotify}
          onHide={handleCloses}
          size="lg"
          centered
          scrollable
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Loại lỗi</th>
                  <th>Số hàng </th>
                  <th>Mô tả lỗi </th>
                </tr>
              </thead>
              <tbody>
                {dataError &&
                  dataError.length > 0 &&
                  dataError.map((item, index) => {
                    return (
                      <tr key={`sc-${index}`}>
                        <td>{item.type}</td>
                        <td>{item.position}</td>
                        <td>{item.errorDescription}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloses}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SNCheck;
