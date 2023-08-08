import React, { useEffect, useState } from "react";
import "./barcodecheck.scss";
import useScanDetection from "use-scan-detection";
import { checkBarcode, updatePoDetail, writeAllNK, writeAllXK } from "../../service/service";
import moment from "moment";
import { utils, writeFile } from "xlsx";
import { toast } from "react-toastify";

const BarCodeCheck = () => {
  const [barcodeScan, setBarcodeScan] = useState("");
  const [dataBarcode, setDataBarcode] = useState([]);
  const [listPoDetailID, setListPoDetailID] = useState([]);
  const [successfulGhiNKRows, setSuccessfulGhiNKRows] = useState([]);
  const [successfulGhiXKRows, setSuccessfulGhiXKRows] = useState([]);

 const BarcodeScanner = async () => {
   let res = await checkBarcode(barcodeScan);
   if (res && res.statusCode === 200) {
     const newData = res.data;
     const dataList = localStorage.getItem("dataBarcode");
     let newDataList = [];
     if (dataList) {
       newDataList = JSON.parse(dataList);
     }
     newDataList.unshift(newData);
     localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
     // localStorage.setItem("podetailID", JSON.stringify(newDataList.poDetailId));
     setDataBarcode(newDataList.flat());
   } else {
     const dataList = localStorage.getItem("dataBarcode");
     let newDataList = [];
     if (dataList) {
       newDataList = JSON.parse(dataList);
     }
     newDataList.unshift({
       serialNumber: barcodeScan,
       product: {
         productName: null,
         producId: null,
       },
       po: {
         poNumber: "SN không tồn tại",
       },
       repairCategory: null,
       warrantyPeriod: null,
     });
     localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
     setDataBarcode(newDataList.flat());
   }
 };

 useEffect(() => {
   const dataList = localStorage.getItem("dataBarcode");
   if (dataList) {
     const parsedDataList = JSON.parse(dataList);
     if (Array.isArray(parsedDataList)) {
       setDataBarcode(parsedDataList.flat());
     } else {
       setDataBarcode([]);
     }
     setBarcodeScan("");
   }
 }, []);

 useEffect(() => {
   if (dataBarcode && dataBarcode.length > 0) {
     const newDataList = dataBarcode
       .filter((item) => item.poDetailId) // Loại bỏ các item không có poDetailId
       .map((item) => item.poDetailId)
       .join(" "); // Kết hợp thành chuỗi cách nhau bằng dấu cách
     localStorage.setItem("podetailId", newDataList);
   }
 }, [dataBarcode]);

 const handleScanComplete = async (scanResult) => {
   const processedScanResult = scanResult
     .replaceAll("Shift", "")
     .replaceAll(/[^A-Za-z0-9]/g, "");

   if (processedScanResult.length > 0) {
     const focusedElement = document.activeElement;
     const isBarcodeFieldFocused =
       focusedElement &&
       focusedElement.tagName === "INPUT" 
     if (isBarcodeFieldFocused) {
       setBarcodeScan(processedScanResult);
       await BarcodeScanner(); // Gọi BarcodeScanner trực tiếp mà không sử dụng thời gian chờ
       setBarcodeScan(""); // Đặt lại giá trị barcodeScan sau mỗi lần quét
     }
   }
 };

 useScanDetection({
   onComplete: handleScanComplete,
   minLength: 1,
 });

 //delete barcode
 const handleDelete = (item) => {
   const index = dataBarcode.findIndex((i) => i.poDetailId === item.poDetailId);
   if (index !== -1) {
     const newDataList = [...dataBarcode];
     newDataList.splice(index, 1);
     localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
     setDataBarcode(newDataList);
   }
 };

  // write nhập kho
  const writeNK = async (item) => {
    const now = new Date();
    const timestamp = now.getTime();

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
      setSuccessfulGhiNKRows((prevRows) => [...prevRows, item.poDetailId]);
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const rowStyles = {
    backgroundColor: "#f69697",
  };

  // color write nk and xk
  const rowStyle = (item) => {
    return item.po.poNumber === "SN không tồn tại"
      ? rowStyles
      : successfulGhiNKRows.includes(item.poDetailId)
      ? { backgroundColor: "#c3e6cb" }
      : successfulGhiXKRows.includes(item.poDetailId)
      ? { backgroundColor: "#ffeb99" }
      : { backgroundColor: "#ffffff" };
  };

  // write xuất kho
  const writeXK = async (item) => {
    const now = new Date();
    const timestamp = now.getTime();

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
      setSuccessfulGhiXKRows((prevRows) => [...prevRows, item.poDetailId]);
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const handleReset = () => {
    window.location.reload();
    setBarcodeScan("");
    localStorage.removeItem("dataBarcode");
    localStorage.removeItem("podetailId");
  };


  // export barcode excel
  const handleExportBarcode = () => {
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
      "Cập nhật XK",
      "Cập nhật KCS",
      "Cập nhật BH",
      "Ghi chú",
    ];

    const exportData = [
      selectedColumns,
      ...dataBarcode.map((item, index) => {
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
                return "Ưu tiên";
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

    writeFile(workbook, "barcode_check.xlsx");
  };

  const handleWriteNKAll = async () => {
    const modifiedList = localStorage.getItem("podetailId");
    console.log(listPoDetailID);
    let res = await writeAllNK(modifiedList);
    if (res && res.statusCode === 200) {
      toast.success("Ghi thành công!!");
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const handleWriteXKAll = async () => {
    const modifiedList = localStorage.getItem("podetailId");
    console.log(listPoDetailID);
    let res = await writeAllXK(modifiedList);
    if (res && res.statusCode === 200) {
      toast.success("Ghi thành công!!");
    } else {
      toast.error("Ghi không thành công!!");
    }
  };

  const formatProductName = (name) => {
    if(name === null) {
      return name
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
    <div className="barcode">
      <div className="my-3 add-new d-flex justify-content-between">
        <div></div>
        <div className="group-btn d-flex ">
          <>
            <div className="">
              <div className="btn-search input-group w-100">
                <input
                  className="form-control3"
                  placeholder="Barcode..."
                  value={barcodeScan}
                  onChange={(e) => setBarcodeScan(e.target.value)}
                />
              </div>
            </div>
            <div className="update-po  mx-1">
              <button className="btn btn-primary " onClick={handleReset}>
                Reset
              </button>
            </div>
            <div className="update-po me-1">
              <button className="btn btn-primary " onClick={handleWriteNKAll}>
                Ghi NK All
              </button>
            </div>
            <div className="update-po me-1">
              <button className="btn btn-warning " onClick={handleWriteXKAll}>
                Ghi XK All
              </button>
            </div>
            <div className="update-po">
              <button
                className="btn btn-success "
                onClick={handleExportBarcode}
              >
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataBarcode &&
              dataBarcode.length > 0 &&
              dataBarcode.map((item, index) => {
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

                const formattedProductName = formatProductName(
                  item.product.productName
                );

                const reverseIndex = dataBarcode.length - index;

                return (
                  <tr
                    key={`sc-${index}`}
                    style={rowStyle(item)}
                    className="table-striped"
                  >
                    <td>{reverseIndex}</td>
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
                            className="btn btn-warning mx-1 btn-sm"
                            onClick={() => writeXK(item)}
                          >
                            Ghi XK
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item)}
                          >
                            Del
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
