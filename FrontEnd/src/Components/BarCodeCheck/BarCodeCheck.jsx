import React, { useEffect, useState } from "react";
import "./barcodecheck.scss";
import useScanDetection from "use-scan-detection";
import Table from "react-bootstrap/Table";
import { checkBarcode, updatePoDetail } from "../../service/service";
import moment from "moment";
import { utils, writeFile } from "xlsx";
import { toast } from "react-toastify";
import ModalDeletePODetail from "../Modal/PO_DETAIL/ModalDelete/ModalDeletePODetail";

const BarCodeCheck = () => {
  const [barcodeScan, setBarcodeScan] = useState("");
  const [data, setData] = useState([]);
  let timeout;

  const BarcodeScanner = async () => {
    let res = await checkBarcode(barcodeScan);
    if (res && res.statusCode === 200) {
      const newData = res.data;
      const dataList = localStorage.getItem("dataBarcode");
      let newDataList = [];
      if (dataList) {
        newDataList = JSON.parse(dataList);
      }
      newDataList.push(newData);
      localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
      setData(newDataList.flat()); // cập nhật data với kết quả mới
    } else {
      const dataList = localStorage.getItem("dataBarcode");
      let newDataList = [];
      if (dataList) {
        newDataList = JSON.parse(dataList);
      }
      newDataList.push({
        serialNumber: barcodeScan,
        product: {
          productName: null,
        producId: null,
        },
        po: {
          poNumber: "SN không tồn tại"
        },
        repairCategory: null,
        warrantyPeriod: null
      });
      localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
      setData(newDataList.flat()); // cập nhật data với số serial mới
    }
  };

  useEffect(() => {
    const dataList = localStorage.getItem("dataBarcode");
    if (dataList) {
      const parsedDataList = JSON.parse(dataList);
      if (Array.isArray(parsedDataList)) {
        setData(parsedDataList.flat());
      } else {
        setData([]);
      }
      setBarcodeScan("");
    }
  }, []);

  const handleScanComplete = (scanResult) => {
    const processedScanResult = scanResult.replaceAll("Shift", "");
    setBarcodeScan(processedScanResult);
    clearTimeout(timeout); // xóa hết các đợt chờ trước đó
    timeout = setTimeout(() => {
      BarcodeScanner(); // set một đợt chờ mới và gọi hàm BarcodeScanner
      setBarcodeScan(""); // set giá trị của barcodeScan thành rỗng sau mỗi lần quét
    }, 0);
  };

  useScanDetection({
    onComplete: handleScanComplete,
    minLength: 3,
  });

  const handleReset = () => {
    setBarcodeScan("");
    localStorage.removeItem("dataBarcode");
    window.location.reload();
  };

  const handleExport = () => {
    let selectedColumns = [
      "Số serial",
      "Tên sản phẩm",
      "Mã hàng hóa",
      "Số PO",
      "Hạng mục SC",
      "Cập nhật BH",
    ];

    const exportData = [
      selectedColumns,
      ...data.map((item, index) => {
        return [
          // index + 1,
          ...selectedColumns.slice(0).map((column) => {
            if (column === "Tên sản phẩm") {
              return item.product.productName;
            }
            if (column === "Mã hàng hóa") {
              return item.product.productId;
            }
            if (column === "Số serial") {
              return item.serialNumber;
            }
            if (column === "Số PO") {
              return item.po.poNumber;
            }
            if (column === "Hạng mục SC") {
              if (item.repairCategory === 0) {
                return "Hàng SC";
              } else if (item.repairCategory === 1) {
                return "Hàng BH";
              }
            }
            if (column === "Cập nhật BH") {
              if (item.warrantyPeriod) {
                return moment(item.warrantyPeriod).format("DD/MM/YYYY");
              }
            }
          }),
        ];
      }),
    ];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(exportData);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "barcode_check.xlsx");
  };

  const writeNK = async (item) => {
    const now = new Date();
    const timestamp = now.getTime();
    //  const longValue = timestamp >> 0;

    let res = await updatePoDetail(
      item.poDetailId,
      item.bbbgNumberImport,
      timestamp,
      item.repairCategory,
      item.priority,
      item.repairStatus,
      item.exportPartner,
      item.kcsVT,
      item.warrantyPeriod,
      item.bbbgNumberExport,
      item.note
    );

    if (res && res.statusCode === 200) {
      toast.success("Ghi thành công!!");
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const writeXK = async (item) => {
    const now = new Date();
    const timestamp = now.getTime();
    //  const longValue = timestamp >> 0;

    let res = await updatePoDetail(
      item.poDetailId,
      item.bbbgNumberImport,
      item.importDate,
      item.repairCategory,
      item.priority,
      item.repairStatus,
      timestamp,
      item.kcsVT,
      item.warrantyPeriod,
      item.bbbgNumberExport,
      item.note
    );

    if (res && res.statusCode === 200) {
      toast.success("Ghi thành công!!");
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const handleDelete = (item) => {
    const index = data.findIndex((i) => i.poDetailId === item.poDetailId);
    if (index !== -1) {
      const newDataList = [...data];
      newDataList.splice(index, 1);
      localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
      setData(newDataList);
    }
  };
  return (
    <div className="barcode">
      <div className="my-3 add-new d-flex justify-content-between">
        <div className="col-6 d-flex"></div>
        <div className="group-btn d-flex justify-content-between">
          <>
            <div className="col-7">
              <div className="btn-search input-group w-100">
                <input
                  className="form-control3"
                  placeholder="Barcode..."
                  value={barcodeScan}
                  onChange={(e) => setBarcodeScan(e.target.value)}
                />
              </div>
            </div>
            <div className="update-po col-2 mx-2">
              <button className="btn btn-primary " onClick={handleReset}>
                Reset
              </button>
            </div>
            <div className="update-po">
              <button className="btn btn-success mx-1" onClick={handleExport}>
                Export
              </button>
            </div>
          </>
        </div>
      </div>
      <div className="table-barcode">
        <table className="table-shadow  table-barcode-scan  table-bordered table-hover">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Số serial</th>
              <th>Tên sản phẩm</th>
              <th>Mã hàng hóa</th>
              <th>Số PO</th>
              <th>Hạng mục SC</th>
              <th>Cập nhật BH</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const rowStyles = {
                backgroundColor: "#f69697",
              };
              const timeExport = item.exportPartner;
              const time = item.importDate;
              const timeWarranty = item.warrantyPeriod;
              let dataWarranty = "";
              let data = "";
              let dataExportPartner = "";
              if (timeWarranty) {
                dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
              }
              if (time) {
                data = moment(time).format("DD/MM/YYYY");
              }
              if (timeExport) {
                dataExportPartner = moment(timeExport).format("DD/MM/YYYY");
              }
              const rowStyle =
                item.po.poNumber === "SN không tồn tại"
                  ? rowStyles
                  : { backgroundColor: "#ffffff" };
              return (
                <tr
                  key={`sc-${index}`}
                  style={rowStyle}
                  className="table-striped"
                >
                  <td>{index + 1}</td>
                  <td>{item.serialNumber}</td>
                  <td>{item.product.productName}</td>
                  <td>{item.product.productId}</td>
                  <td>{item.po.poNumber}</td>
                  <td>
                    {item.repairCategory === 0 && "Hàng SC"}
                    {item.repairCategory === 1 && "Hàng BH"}
                  </td>
                  <td>{dataWarranty}</td>
                  <td className="col-barcode-action">
                    {localStorage.getItem("role") === "ROLE_ADMIN" ||
                    localStorage.getItem("role") === "ROLE_MANAGER" ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm "
                          onClick={() => writeNK(item)}
                        >
                          Ghi NK
                        </button>
                        <button
                          className="btn btn-warning mx-2 btn-sm"
                          onClick={() => writeXK(item)}
                        >
                          Ghi XK
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <ModalDeletePODetail
        show={showDelete}
        handleCloses={handleCloses}
        dataDeletePODetail={dataDeletePODetail}
        // getProducts={getProducts}
        // currenPage={currenPage}
      /> */}
    </div>
  );
};

export default BarCodeCheck;
