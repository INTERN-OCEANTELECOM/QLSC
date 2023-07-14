import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import { FaFileImport } from "react-icons/fa";
import { read, utils, writeFile } from "xlsx";
import ReactPaginate from "react-paginate";
import "./tablehh.scss";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import { Modal, Button, Row, InputGroup } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import {
  exportByPO,
  fecthAllPoDetail,
  getAllPoDetail,
  getPo,
  importPODetail,
  searchPODetail,
  updateStatusPoDetail,
} from "../../service/service";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ModalUpdatePoDetail from "../Modal/PO_DETAIL/ModalUpdate/ModalUpdatePoDetail";
import ModalShowPoDetail from "../Modal/PO_DETAIL/ModalShow/ModalShowPoDetail";
import { saveAs } from "file-saver";
import ModalDeletePODetail from "../Modal/PO_DETAIL/ModalDelete/ModalDeletePODetail";

export const TableHH = () => {
  const [listPoDetail, setListPoDetail] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [isShowNotifyUpdateSC, setIsShowNotifyUpdateSC] = useState(false);
  const [isShowNotifyUpdateXK, setIsShowNotifyUpdateXK] = useState(false);
  const [isShowNotifyUpdateKCS, setIsShowNotifyUpdateKCS] = useState(false);
  const [isShowNotifyUpdateBH, setIsShowNotifyUpdateBH] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateEditPoDetail, setDataEditPoDetail] = useState("");
  const [dateShowPoDetail, setDataShowPoDetail] = useState("");
  const [listAllPoDetail, setListAllPoDetail] = useState("");
  const [isShowEditPoDetail, setisShowEditPoDetail] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isShowPoDetail, setIsShowPoDetail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("25");
  const [checkboxes, setCheckboxes] = useState({
    defaultCheck1: false,
    defaultCheck2: false,
    defaultCheck3: false,
    defaultCheck4: false,
  });
  const [productId, setProductId] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [poNumber, setPoNumber] = useState(null);
  const [bbbg, setBbbg] = useState(null);
  const [importDate, setImportDate] = "";
  const [repairCategory, setRepairCategory] = useState(null);
  const [repairStatus, setRepairStatus] = useState(null);
  const [exportPartner, setExportPartner] = useState(null);
  const [kcsVt, setKcsVt] = useState(null);
  const [po, setPo] = useState("getAll");
  const [listPo, setListPo] = useState("");
  const [priority, setPriority] = useState(null);
  const [currenPage, setCurrentPage] = useState("")
  const [showDelete, setShowDelete] = useState(false)
  const [dataDeletePODetail, setDataDeletePoDetail] = useState("")

  // call api when load page
  useEffect(() => {
    if (
      productId ||
      serialNumber ||
      poNumber ||
      bbbg ||
      selectedDateStart ||
      repairCategory ||
      repairStatus ||
      exportPartner ||
      kcsVt ||
      priority
    ) {
      handleSearch(0);
    } else {
      getProducts(0);
      getAllPO();
    }
  }, [selectedOption]);

  // handle change date start
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };
  const handleDateChangeExportPartner = (date) => {
    setExportPartner(date);
  };

  // custom input icon calendar
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input">
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
      />
      <div className="icon-container" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" />
      </div>
    </div>
  ));

  // call api get product by page
  const getProducts = async (page) => {
    try {
      let res = await fecthAllPoDetail(page, selectedOption);
      if (res && res.data) {
        setListPoDetail(res.data);
        setTotalProducts(res.totalPages);
        setTotalPages(res.data.number);
      }
    } catch (error) {
      setLoadingMessage("Lỗi khi tải dữ liệu.");
    }
  };

  // call api get all po
  const getAllPO = async () => {
    let res = await getPo();
    if (res && res.statusCode === 200) {
      setListPo(res.data);
    }
  };
  // import po detail
  const handleFileUpload = async (event) => {
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
      let response = await importPODetail(formData);
      if (response && response.statusCode === 200) {
        toast.success("Dữ liệu đã được tải thành công!!");
        setIsShowNotify(true);
        setData(response.data);
        getProducts(0);
      } else {
        toast.error("Dữ liệu đã được tải không thành công!");
        setData(response.data);
        setIsShowNotify(true);
      }
    } catch (error) {
      toast.error("Dữ liệu đã được tải không thành công!");
    } finally {
      setIsLoading(false);
      event.target.value = null; // Reset giá trị của input file
    }
  };

  // handle import status po detail
  const handleUploadSC = async (event) => {
    try {
      const selectedState = event.target.id;
      let selectUpdateValue = "";

      if (selectedState === "test1") {
        selectUpdateValue = "repairStatus";
      } else if (selectedState === "test2") {
        selectUpdateValue = "exportPartner";
      } else if (selectedState === "test3") {
        selectUpdateValue = "kcsVT";
      } else if (selectedState === "test4") {
        selectUpdateValue = "warrantyPeriod";
      } else if (selectedState === "test5") {
        selectUpdateValue = "repairCategory";
      } else if (selectedState === "test6") {
        selectUpdateValue = "priority";
      } else if (selectedState === "test7") {
        selectUpdateValue = "importDate";
      } else if (selectedState === "test8") {
        selectUpdateValue = "bbbgNumber";
      } else if (selectedState === "test9") {
        selectUpdateValue = "bbbgNumberExport";
      }

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
      formData.append("attribute", selectUpdateValue);
      setIsLoading(true);
      let response = await updateStatusPoDetail(formData);
      if (response && response.statusCode === 200) {
        toast.success("Dữ liệu đã được tải thành công!");
        setIsShowNotify(true);
        setData(response.data);
        getProducts(0);
      } else {
        toast.error("Dữ liệu đã được tải không thành công!");
        setData(response.data);
        setIsShowNotify(true);
      }
    } catch (error) {
      toast.error("Dữ liệu đã được tải không thành công!");
    } finally {
      setIsLoading(false);
      event.target.value = null;
    }
  };

  // Page
  const itemsPerPage = selectedOption;
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const newStartIndex = selectedPage * itemsPerPage;
    setStartIndex(newStartIndex);
    if (
      productId ||
      serialNumber ||
      poNumber ||
      bbbg ||
      selectedDateStart ||
      repairCategory ||
      repairStatus ||
      exportPartner ||
      kcsVt ||
      priority
    ) {
      handleSearch(+event.selected);
    } else {
      getProducts(+event.selected);
      setCurrentPage(selectedPage);
    }
  };

  // Export

  const handleExport = async () => {
    let selectedData = [];
    let selectedColumns = [
      "Tên sản phẩm",
      "Mã hàng hóa",
      "Số serial",
      "Số PO",
      "Ngày nhập kho",
      "Hạng mục SC",
      "Ưu Tiên SC",
    ];

    if (checkboxes.defaultCheck1) {
      selectedColumns.push("Cập nhật SC");
    }

    if (checkboxes.defaultCheck2) {
      selectedColumns.push("Số BBXK", "Cập nhật XK");
    }

    if (checkboxes.defaultCheck3) {
      selectedColumns.push( "Cập nhật KCS");
    }

    if (checkboxes.defaultCheck4) {
      selectedColumns.push("Cập nhật BH");
    }

    selectedColumns.unshift("STT");

    if (
      checkboxes.defaultCheck1 ||
      checkboxes.defaultCheck2 ||
      checkboxes.defaultCheck3 ||
      checkboxes.defaultCheck4
    ) {
      let res = await exportByPO(po);
      if (res && res.statusCode === 200) {
        selectedData = res.data;
      }

      // selectedData = data.filter((item) => item.serialNumber);
      const exportData = [
        selectedColumns,
        ...selectedData.map((item, index) => {
          return [
            index + 1,
            ...selectedColumns.slice(1).map((column) => {
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
                  return 
                } else if (item.priority === 1) {
                  return "Ưu tiên";
                }
              }
              if (column === "Cập nhật SC") {
                if (item.repairStatus === 1) {
                  return "Sửa chữa xong";
                } else if (item.repairStatus === 0) {
                  return "Sửa chữa không được";
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
            }),
          ];
        }),
      ];

      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet(exportData);
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      writeFile(workbook, "po_detail.xlsx");
    }
  };

  // export notify error when import
  const handleExportNotify = () => {
    const columnHeader = ["Loại lỗi", "Số hàng", "Mô tả lỗi"];
    const dataArray = [columnHeader, ...data.map((obj) => Object.values(obj))];
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "mo_ta_po_detail.xlsx");
  };

  // handle close modal
  const handleCloses = () => {
    setIsShowNotify(false);
    setIsShowNotifyUpdateSC(false);
    setIsShowNotifyUpdateXK(false);
    setIsShowNotifyUpdateKCS(false);
    setIsShowNotifyUpdateBH(false);
    setisShowEditPoDetail(false);
    setIsShowPoDetail(false);
    setShowDelete(false);
  };

  // Search

  const handleSearch = async (page) => {
    let time = selectedDateStart;
    let timeExport = exportPartner

    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    if(exportPartner !== null ) {
      timeExport = moment(exportPartner).format("DD/MM/YYYY");
    }
    let res = await searchPODetail(
      [
        productId,
        serialNumber,
        poNumber,
        bbbg,
        time,
        repairCategory,
        repairStatus,
        timeExport,
        kcsVt,
        priority,
      ],
      "ALL",
      page,
      selectedOption
    );
    if (res && res.statusCode === 200) {
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setTotalPages(res.data.number);
      
    } 
    if (res && res.statusCode === 204) {
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      // setTotalPages(res.data.number);
    }
    
  };

  // handle edit po detail
  const handleEditPoDetail = (item) => {
    setisShowEditPoDetail(true);
    setDataEditPoDetail(item);
    console.log("tui check", item);
  };

  // handle show po detail
  const handleShowPoDetail = (item) => {
    setIsShowPoDetail(true);
    setDataShowPoDetail(item);
  };

  // handle download file sample
  const handleDownloadSampleFileImport = () => {
    const columnHeader = [
      "Mã hàng hóa",
      "Số serial",
      "Số PO",
    ];
    const dataArray = [columnHeader];
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "importHH.xlsx");
  };

  const handleDownloadSampleFile = (index) => {
    let namefile
    const columnHeader = ["Mã hàng hóa", "Số serial", "Số PO"];
    if (index === 1) {
      columnHeader.push("Cập nhật SC");
      namefile = "Cap-nhat-SC.xlsx";
    } else if (index === 2) {
      columnHeader.push("Cập nhật XK", "Số BBXK");
      namefile = "Cap-nhat-XK.xlsx";
    } else if (index === 3) {
      columnHeader.push("Cập nhật KCS");
      namefile = "Cap-nhat-KCS.xlsx";
    } else if (index === 4) {
      columnHeader.push("Cập nhật BH");
      namefile = "Cap-nhat-BH.xlsx";
    } else if (index === 5) {
      columnHeader.push("Ưu Tiên SC");
      namefile = "uu-tien-SC.xlsx";
    } else if (index === 6) {
      columnHeader.push("Ngày nhập kho");
      namefile = "ngay-nhap-kho.xlsx";
    } else if (index === 7) {
      columnHeader.push("Hạng mục SC");
      namefile = "hang-muc-sc.xlsx";
    } 
    const dataArray = [ columnHeader];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, namefile);
  };

  // handle reset
  const handleReset = () => {
    window.location.reload();
  }

  // handle delete Po detail
  const handleDeletePoDetail = (item) => {
    setShowDelete(true)
    setDataDeletePoDetail(item)
  }

  return (
    <>
      <div className="tables">
        <div className="table-action">
          <div>
            {/* search po-detail */}
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Mã hàng hóa</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={productId !== null ? productId : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductId(value !== "" ? value : null);
                  }}
                  placeholder="Mã hàng hóa"
                />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom02">
                <Form.Label>Số serial</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={serialNumber !== null ? serialNumber : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSerialNumber(value !== "" ? value : null);
                  }}
                  placeholder="Số serial"
                />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername1">
                <Form.Label>Số PO</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setPoNumber(value === "Tất cả PO" ? null : value);
                  }}
                >
                  <option>Tất cả PO</option>
                  {listPo &&
                    listPo.length > 0 &&
                    listPo.map((item, index) => {
                      return (
                        <option key={index} value={item.poNumber}>
                          {item.poNumber}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom05">
                <Form.Label>Ưu tiên SC</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setPriority(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  {/* <option value="0">Không ưu tiên</option> */}
                  <option value="1">Ưu tiên</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername3">
                <Form.Label>Ngày nhập kho</Form.Label>
                <div className="">
                  <DatePicker
                    selected={selectedDateStart}
                    onChange={handleDateChangeStart}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername4">
                <Form.Label>Hạng mục SC</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setRepairCategory(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">Nhập kho sửa chữa</option>
                  <option value="1">Nhập kho bảo hành</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationCustom03">
                <Form.Label>Cập nhật SC</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setRepairStatus(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">Sửa chữa không được</option>
                  <option value="1">Sửa chữa xong</option>
                  <option value="2">Cháy nổ</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername2">
                <Form.Label>Số BBXK</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Số BBXK"
                    value={bbbg !== null ? bbbg : ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setBbbg(value !== "" ? value : null);
                    }}
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom04">
                <Form.Label>Cập nhật XK</Form.Label>
                <DatePicker
                  selected={exportPartner}
                  onChange={handleDateChangeExportPartner}
                  customInput={<CustomInput />}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom05">
                <Form.Label>Cập nhật KCS</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setKcsVt(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">FAIL</option>
                  <option value="1">PASS</option>
                </Form.Select>
              </Form.Group>
            </Row>
            {/* admin and manager permission to display the export button */}
            {localStorage.getItem("role") === "ROLE_MANAGER" ||
            localStorage.getItem("role") === "ROLE_ADMIN" ? (
              <Row className="mb-3 d-flex justify-content-center align-items-center">
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername7"
                >
                  <Form.Label>Trạng thái xuất: </Form.Label>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername99"
                >
                  {/* <Form.Label>Xuất theo PO</Form.Label> */}
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => {
                      const value = event.target.value;
                      setPo(value === "Tất cả PO" ? "getAll" : value);
                    }}
                  >
                    <option>Tất cả PO</option>
                    {listPo &&
                      listPo.length > 0 &&
                      listPo.map((item, index) => {
                        return (
                          <option key={index} value={item.poNumber}>
                            {item.poNumber}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername8"
                >
                  <div className="form-check   label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxes.defaultCheck1 || selectAll}
                      onChange={() =>
                        setCheckboxes({
                          ...checkboxes,
                          defaultCheck1: !checkboxes.defaultCheck1,
                        })
                      }
                      id="defaultCheck1"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="defaultCheck1"
                    >
                      Cập nhật SC
                    </label>
                  </div>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername9"
                >
                  <div className="form-check label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxes.defaultCheck2 || selectAll}
                      onChange={() =>
                        setCheckboxes({
                          ...checkboxes,
                          defaultCheck2: !checkboxes.defaultCheck2,
                        })
                      }
                      id="defaultCheck2"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="defaultCheck2"
                    >
                      Cập nhật XK
                    </label>
                  </div>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername12"
                >
                  <div className="form-check label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxes.defaultCheck3 || selectAll}
                      onChange={() =>
                        setCheckboxes({
                          ...checkboxes,
                          defaultCheck3: !checkboxes.defaultCheck3,
                        })
                      }
                      id="defaultCheck3"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="defaultCheck3"
                    >
                      Cập nhật KCS
                    </label>
                  </div>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername13"
                >
                  <div className="form-check label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => {
                        setSelectAll(!selectAll);
                        setCheckboxes({
                          defaultCheck1: !selectAll,
                          defaultCheck2: !selectAll,
                          defaultCheck3: !selectAll,
                          defaultCheck4: !selectAll,
                        });
                      }}
                      id="selectAllCheckbox"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="selectAllCheckbox"
                    >
                      Tất cả
                    </label>
                  </div>
                </Form.Group>
              </Row>
            ) : null}
            {/* {/* repairman permission to display the export button */}
            {localStorage.getItem("role") === "ROLE_REPAIRMAN" ? (
              <Row className="mb-3 d-flex  align-items-center">
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername7"
                >
                  <Form.Label>Trạng thái xuất: </Form.Label>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername99"
                >
                  {/* <Form.Label>Xuất theo PO</Form.Label> */}
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => {
                      const value = event.target.value;
                      setPo(value === "Tất cả PO" ? "getAll" : value);
                    }}
                  >
                    <option>Tất cả PO</option>
                    {listPo &&
                      listPo.length > 0 &&
                      listPo.map((item, index) => {
                        return (
                          <option key={index} value={item.poNumber}>
                            {item.poNumber}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername8"
                >
                  <div className="form-check   label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxes.defaultCheck1 || selectAll}
                      onChange={() =>
                        setCheckboxes({
                          ...checkboxes,
                          defaultCheck1: !checkboxes.defaultCheck1,
                        })
                      }
                      id="defaultCheck1"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="defaultCheck1"
                    >
                      Cập nhật SC
                    </label>
                  </div>
                </Form.Group>
              </Row>
            ) : null}
            {/* kcsanalyst permission to display the export button */}
            {localStorage.getItem("role") === "ROLE_KCSANALYST" ? (
              <Row className="mb-3 d-flex  align-items-center">
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername7"
                >
                  <Form.Label>Trạng thái xuất: </Form.Label>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername99"
                >
                  {/* <Form.Label>Xuất theo PO</Form.Label> */}
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => {
                      const value = event.target.value;
                      setPo(value === "Tất cả PO" ? "getAll" : value);
                    }}
                  >
                    <option>Tất cả PO</option>
                    {listPo &&
                      listPo.length > 0 &&
                      listPo.map((item, index) => {
                        return (
                          <option key={index} value={item.poNumber}>
                            {item.poNumber}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  controlId="validationCustomUsername12"
                >
                  <div className="form-check label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkboxes.defaultCheck3 || selectAll}
                      onChange={() =>
                        setCheckboxes({
                          ...checkboxes,
                          defaultCheck3: !checkboxes.defaultCheck3,
                        })
                      }
                      id="defaultCheck3"
                    />
                    <label
                      className="form-check-label font-size"
                      htmlFor="defaultCheck3"
                    >
                      Cập nhật KCS
                    </label>
                  </div>
                </Form.Group>
              </Row>
            ) : null}
          </div>

          {/* button */}
          <div className="my-3 add-new d-flex justify-content-between">
            <div className="col-3"></div>
            <div className="group-btn d-flex">
              {/* button search */}

              <div className="search">
                <button
                  className="btn btn-primary label-search"
                  onClick={() => handleReset()}
                >
                  Reset
                </button>
              </div>
              <div className="search">
                <button
                  className="btn btn-primary label-search"
                  onClick={() => handleSearch()}
                >
                  <AiOutlineSearch className="icon-search" />
                  Search
                </button>
              </div>
              {/* admin and manager permission to display button */}
              {localStorage.getItem("role") === "ROLE_MANAGER" ||
              localStorage.getItem("role") === "ROLE_ADMIN" ? (
                <>
                  <div className="update update-btn">
                    <NavDropdown
                      title="Sample files"
                      id="basic-nav-dropdown"
                      className="btn btn-success nav-drop"
                    >
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFileImport()}
                        >
                          Import HH
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(6)}
                        >
                          Ngày nhập kho
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(7)}
                        >
                          Hạng mục SC
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(5)}
                        >
                          Ưu tiên SC
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(1)}
                        >
                          Cập nhật SC
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(2)}
                        >
                          Cập nhật XK
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(3)}
                        >
                          Cập nhật KCS
                        </button>
                      </div>
                      <div className="update-state">
                        <button
                          className="dropdown-item label-state"
                          onClick={() => handleDownloadSampleFile(4)}
                        >
                          Cập nhật BH
                        </button>
                      </div>
                    </NavDropdown>
                  </div>

                  <div className="import">
                    <label
                      htmlFor="test"
                      className="btn btn-danger label-import"
                    >
                      <FaFileImport className="icon-import" />
                      Import
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      id="test"
                      hidden
                    />
                  </div>
                </>
              ) : null}
              {/* repairman permission to display the update button */}
              {localStorage.getItem("role") === "ROLE_REPAIRMAN" ? (
                <div className="update update-btn">
                  <NavDropdown
                    title="Update"
                    id="basic-nav-dropdown"
                    className="btn btn-warning nav-drop"
                  >
                    <div className="update-state">
                      <label
                        htmlFor="test1"
                        className="dropdown-item label-state"
                      >
                        Cập nhật SC
                      </label>
                      <input
                        type="file"
                        id="test1"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                  </NavDropdown>
                </div>
              ) : null}
              {/* kcsanalyst permission to display the update button */}
              {localStorage.getItem("role") === "ROLE_KCSANALYST" ? (
                <div className="update update-btn">
                  <NavDropdown
                    title="Update"
                    id="basic-nav-dropdown"
                    className="btn btn-warning nav-drop"
                  >
                    <div className="update-state">
                      <label
                        htmlFor="test3"
                        className="dropdown-item label-state"
                      >
                        Cập nhật KCS
                      </label>
                      <input
                        type="file"
                        id="test3"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                  </NavDropdown>
                </div>
              ) : null}
              {/* admin and manager permission to display the update button */}
              {localStorage.getItem("role") === "ROLE_MANAGER" ||
              localStorage.getItem("role") === "ROLE_ADMIN" ? (
                <div className="update update-btn">
                  <NavDropdown
                    title="Update"
                    id="basic-nav-dropdown"
                    className="btn btn-warning nav-drop"
                  >
                    <div className="update-state">
                      <label
                        htmlFor="test7"
                        className="dropdown-item label-state"
                      >
                        Ngày nhập kho
                      </label>
                      <input
                        type="file"
                        id="test7"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test5"
                        className="dropdown-item label-state"
                      >
                        Hạng mục SC
                      </label>
                      <input
                        type="file"
                        id="test5"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test6"
                        className="dropdown-item label-state"
                      >
                        Ưu tiên SC
                      </label>
                      <input
                        type="file"
                        id="test6"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test1"
                        className="dropdown-item label-state"
                      >
                        Cập nhật SC
                      </label>
                      <input
                        type="file"
                        id="test1"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test2"
                        className="dropdown-item label-state"
                      >
                        Cập nhật XK
                      </label>
                      <input
                        type="file"
                        id="test2"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test3"
                        className="dropdown-item label-state"
                      >
                        Cập nhật KCS
                      </label>
                      <input
                        type="file"
                        id="test3"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                    <div className="update-state">
                      <label
                        htmlFor="test4"
                        className="dropdown-item label-state"
                      >
                        Cập nhật BH
                      </label>
                      <input
                        type="file"
                        id="test4"
                        hidden
                        onChange={handleUploadSC}
                      />
                    </div>
                  </NavDropdown>
                </div>
              ) : null}

              {/*permission to display the export button */}
              {localStorage.getItem("role") === "ROLE_MANAGER" ||
              localStorage.getItem("role") === "ROLE_ADMIN" ||
              localStorage.getItem("role") === "ROLE_REPAIRMAN" ||
              localStorage.getItem("role") === "ROLE_KCSANALYST" ? (
                <div className="update">
                  <button
                    className="btn btn-success label-export"
                    onClick={handleExport}
                    disabled={
                      !checkboxes.defaultCheck1 &&
                      !checkboxes.defaultCheck2 &&
                      !checkboxes.defaultCheck3 &&
                      !checkboxes.defaultCheck4
                    }
                  >
                    <AiOutlineDownload className="icon-export" />
                    Export
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* table */}

        <table className="table-shadow  table-color  table-bordered table-hover">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Mã hàng hóa</th>
              <th>Số serial</th>
              <th>Số PO</th>
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
            {listPoDetail &&
              listPoDetail.length > 0 &&
              listPoDetail.map((item, index) => {
                // background color when priority is equal to 1
                const rowStyles = {
                  backgroundColor: "#ffeeba", // Màu nền sáng
                };
                // convert this from long to date
                const timeExport = item.exportPartner;
                const currentIndex = startIndex + index;
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
                return (
                  <tr
                    key={`sc-${currentIndex}`}
                    onDoubleClick={() => handleShowPoDetail(item)}
                    style={rowStyle}
                    className="table-striped"
                  >
                    <td>{currentIndex + 1}</td>
                    <td>{item.product.productId}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    {/* <td>{item.bbbgNumber}</td> */}
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Hàng SC"}
                      {item.repairCategory === 1 && "Hàng BH"}
                    </td>
                    <td>
                      {/* {item.priority === 0 && "Không UT"} */}
                      {item.priority === 1 && "Ưu tiên"}
                    </td>
                    <td>
                      {item.repairStatus === 0 && "SC không được"}
                      {item.repairStatus === 1 && "SC xong"}
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
                    <td className="btn-action">
                      {localStorage.getItem("role") === "ROLE_MANAGER" ||
                      localStorage.getItem("role") === "ROLE_ADMIN" ||
                      localStorage.getItem("role") === "ROLE_REPAIRMAN" ||
                      localStorage.getItem("role") === "ROLE_KCSANALYST" ? (
                        <button
                          className="btn btn-warning btn-sm btn-edit"
                          onClick={() => handleEditPoDetail(item)}
                        >
                          Edit
                        </button>
                      ) : null}

                      {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePoDetail(item)}
                        >
                          Del
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {/* Loading */}

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

        {/* paging */}

        <div className="d-flex justify-content-end align-items-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalProducts}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />

          <Form.Select
            aria-label="Default select example"
            className="form-select-size"
            onChange={(event) => setSelectedOption(event.target.value)}
            value={selectedOption}
          >
            <option value="25">25 / Trang</option>
            <option value="50">50 / Trang</option>
            <option value="75">75 / Trang</option>
            <option value="100">100 / Trang</option>
          </Form.Select>
        </div>

        {/* Modal */}

        <ModalShowPoDetail
          show={isShowPoDetail}
          handleCloses={handleCloses}
          dateShowPoDetail={dateShowPoDetail}
        />

        <ModalUpdatePoDetail
          show={isShowEditPoDetail}
          handleCloses={handleCloses}
          dateEditPoDetail={dateEditPoDetail}
          getProducts={getProducts}
          currenPage={currenPage}
        />

        <ModalDeletePODetail
          show={showDelete}
          handleCloses={handleCloses}
          dataDeletePODetail={dataDeletePODetail}
          getProducts={getProducts}
          currenPage={currenPage}
        />
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
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
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
              <Button variant="primary" onClick={handleExportNotify}>
                Export
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};
