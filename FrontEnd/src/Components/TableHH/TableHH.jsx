import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
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
  checkBarcode,
  exportByPO,
  fecthAllPoDetail,
  getAllPoDetail,
  getPo,
  importPODetail,
  searchPODetail,
  searchSerialNumber,
  updatePoDetail,
  updateStatusPoDetail,
} from "../../service/service";
import { FaCalendarAlt } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ModalUpdatePoDetail from "../Modal/PO_DETAIL/ModalUpdate/ModalUpdatePoDetail";
import ModalShowPoDetail from "../Modal/PO_DETAIL/ModalShow/ModalShowPoDetail";
import ModalDeletePODetail from "../Modal/PO_DETAIL/ModalDelete/ModalDeletePODetail";
import Autosuggest from "react-autosuggest";
import useScanDetection from "use-scan-detection";

const ItemContext = React.createContext(null);

export const TableHH = () => {
  const [listPoDetail, setListPoDetail] = useState([]);
  const [listPoDetailSN, setListPoDetailSN] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [data, setData] = useState([]);
  const [dataBarcode, setDataBarcode] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateEditPoDetail, setDataEditPoDetail] = useState("");
  const [dateShowPoDetail, setDataShowPoDetail] = useState("");
  const [isShowEditPoDetail, setisShowEditPoDetail] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isShowPoDetail, setIsShowPoDetail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("1000");
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
  const [listPo, setListPo] = useState("");
  const [priority, setPriority] = useState(null);
  const [currenPage, setCurrentPage] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [dataDeletePODetail, setDataDeletePoDetail] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value1, setValue1] = useState(""); 
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [currentPageSearch, setCurrentPageSearch] = useState("");
  const [barcodeScan, setBarcodeScan] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const item = JSON.parse(queryParams.get("item"));
  const [successfulGhiNKRows, setSuccessfulGhiNKRows] = useState([]);
  const [successfulGhiXKRows, setSuccessfulGhiXKRows] = useState([]);
  const [isExportButtonEnabled, setIsExportButtonEnabled] = useState(false);
  const [isExportButtonEnabledSN, setIsExportButtonEnabledSN] = useState(false);
  const [isExportButtonEnabledBC, setIsExportButtonEnabledBC] = useState(false);

  // call api when load page
  useEffect(() => {
    if (
      productId ||
      serialNumber ||
      value1 ||
      item ||
      bbbg ||
      selectedDateStart ||
      repairCategory ||
      repairStatus ||
      exportPartner ||
      kcsVt ||
      priority
    ) {
      if (item) {
        searchByPO(0);
        setValue1(item);
      } else {
        handleSearch(0);
      }
    } else {
      getAllPO();
    }
  }, [selectedOption]);

  // search by po
  const searchByPO = async (page) => {
    let time = selectedDateStart;
    let timeExport = exportPartner;
    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    if (exportPartner !== null) {
      timeExport = moment(exportPartner).format("DD/MM/YYYY");
    }
    let res = await searchPODetail(
      [
        productId,
        serialNumber,
        item,
        bbbg,
        time,
        repairCategory,
        repairStatus,
        timeExport,
        kcsVt,
        priority,
      ],
      "getAll",
      page,
      selectedOption
    );
    if (res && res.statusCode === 200) {
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setTotalPages(res.data.number);
      setCurrentPageSearch(page);
      setIsExportButtonEnabled(true)
    }
    if (res && res.statusCode === 204) {
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setIsExportButtonEnabled(false);
    }
  };


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
        setListPoDetail(response.data);
        setTotalProducts(response.totalPages);
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
      let response = await updateStatusPoDetail(formData);
      if (response && response.statusCode === 200) {
        toast.success("Dữ liệu đã được tải thành công!");
        setListPoDetail(response.data);
        setTotalProducts(response.totalPages);
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
      value1 ||
      item ||
      bbbg ||
      selectedDateStart ||
      repairCategory ||
      repairStatus ||
      exportPartner ||
      kcsVt ||
      priority
    ) {
      if (item) {
        searchByPO(+event.selected);
        setCurrentPageSearch(selectedPage);
      } else {
        handleSearch(+event.selected);
        setCurrentPageSearch(selectedPage);
      }
    } else {
      getProducts(+event.selected);
      setCurrentPage(selectedPage);
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
    setisShowEditPoDetail(false);
    setIsShowPoDetail(false);
    setShowDelete(false);
  };

  // Search

  const handleSearch = async (page) => {
    setListPoDetailSN([]);
    setDataBarcode([]);
    localStorage.removeItem("dataBarcode");
    localStorage.removeItem("dataList");
    let time = selectedDateStart;
    let timeExport = exportPartner;
    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    if (exportPartner !== null) {
      timeExport = moment(exportPartner).format("DD/MM/YYYY");
    }
    let poItem;
    if (item) {
      poItem = item;
    } else {
      if(value1 === "") {
        poItem = null
      } else {
        poItem = value1;
      }
    }
    let res = await searchPODetail(
      [
        productId,
        serialNumber,
        poItem,
        bbbg,
        time,
        repairCategory,
        repairStatus,
        timeExport,
        kcsVt,
        priority,
      ],
      "All",
      page,
      selectedOption
    );
    if (res && res.statusCode === 200) {
      localStorage.removeItem("dataBarcode");
      localStorage.removeItem("dataList");
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setTotalPages(res.data.number);
      setCurrentPageSearch(page);
      setIsExportButtonEnabled(true);
    }
    if (res && res.statusCode === 204) {
      localStorage.removeItem("dataBarcode");
      localStorage.removeItem("dataList");
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setCurrentPageSearch(page);
      setIsExportButtonEnabled(false);
    }
  };

  // handle edit po detail
  const handleEditPoDetail = (item) => {
    setListPoDetailSN([]);
    setData([]);
    localStorage.removeItem("dataBarcode");
    localStorage.removeItem("dataList");
    setisShowEditPoDetail(true);
    setDataEditPoDetail(item);
    console.log("tui check", item);
  };

  // handle download file sample

  const handleDownloadSampleFile = () => {
    const columnHeader = [
      "Mã hàng hóa (*)",
      "Tên thiết bị",
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
    const dataArray = [columnHeader];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "sample_file.xlsx");
  };

  // handle reset
  const handleReset = () => {
    window.location.reload();
    window.location.href = `/quanly`;
    localStorage.removeItem("dataList");
    setBarcodeScan("");
    localStorage.removeItem("dataBarcode");
  };

  const onChange1 = (event, { newValue }) => {
    setValue1(newValue);
    setSelectedSuggestion(null); // Reset selected suggestion when the input changes
  };

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.toLowerCase();
    const allOption = { poNumber: "Tất cả" }; // Tạo option "Tất cả"

    // Lấy danh sách gợi ý từ listPo và thêm option "Tất cả" vào đầu mảng
    const suggestions = [
      allOption,
      ...listPo.filter((item) =>
        item.poNumber.toLowerCase().includes(inputValueLowerCase)
      ),
    ];

    return suggestions;
  };

  const getSuggestionValue = (suggestion) => suggestion.poNumber;

  const renderSuggestion = (suggestion) => <div>{suggestion.poNumber}</div>;

  const onSuggestionsFetchRequested = ({ value }) => {
    // Xóa timeout hiện tại (nếu có)
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Tạo timeout mới
    const timeout = setTimeout(() => {
      setSuggestions(getSuggestions(value));
    }, 1000); // Khoảng thời gian trễ (1 giây)
    setDebounceTimeout(timeout);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedSuggestion(suggestion);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      if (!selectedSuggestion) {
        handleSearch();
      }
    }
  };

  const inputProps1 = {
    placeholder: "Nhập PO",
    value: value1,
    onChange: onChange1,
    onKeyDown: onKeyDown, // Thêm xử lý sự kiện onKeyDown
  };

  //export sn check
  const handleExportSN = () => {
    let selectedColumns = [
      "Mã hàng hóa (*)",
      "Tên thiết bị",
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
              return item.product.productName;
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
      setListPoDetail("");
      setData([]);
      localStorage.removeItem("dataBarcode");
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
        setIsExportButtonEnabledSN(true);

      } else {
        if (response && response.statusCode === 205) {
          setIsShowNotify(true);
          setData(response.data);
          toast.error("Dữ liệu được tải không thành công!!");
        }
      }
    } catch (error) {
      toast.error("Dữ liệu đã được tải không thành công!");
    } finally {
      setIsLoading(false);
      event.target.value = null; // Reset giá trị của input file
    }
  };

  // api barcode scan
  const BarcodeScanner = async () => {
    setListPoDetail("");
    setListPoDetailSN("");
    localStorage.removeItem("dataList");
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
      setDataBarcode(newDataList.flat());
      setIsExportButtonEnabledBC(true);
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
          poNumber: "SN không tồn tại",
        },
        repairCategory: null,
        warrantyPeriod: null,
      });
      localStorage.setItem("dataBarcode", JSON.stringify(newDataList));
      setDataBarcode(newDataList.flat());
      setIsExportButtonEnabledBC(true);
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

  const handleScanComplete = async (scanResult) => {
    const processedScanResult = scanResult
      .replaceAll("Shift", "")
      .replaceAll(/[^A-Za-z0-9]/g, "");

    if (processedScanResult.length > 0) {
      const focusedElement = document.activeElement;
      const isBarcodeFieldFocused =
        focusedElement &&
        focusedElement.tagName === "INPUT" &&
        focusedElement.id === "validationCustomUsername2806";
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
    const index = dataBarcode.findIndex(
      (i) => i.poDetailId === item.poDetailId
    );
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

  // export barcode excel
  const handleExportBarcode = () => {
    let selectedColumns = [
      "Mã hàng hóa (*)",
      "Tên thiết bị",
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
              return item.product.productName;
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

  const handleExportSearch = async () => {
    let selectedColumns = [
      "Mã hàng hóa (*)",
      "Tên thiết bị",
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

    let time = selectedDateStart;
    let timeExport = exportPartner;
    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    if (exportPartner !== null) {
      timeExport = moment(exportPartner).format("DD/MM/YYYY");
    }
    let poItem;
    if (item) {
      poItem = item;
    } else {
      poItem = value1;
    }
    let listPoDetailSearch = []

    let res = await searchPODetail(
      [
        productId,
        serialNumber,
        poItem,
        bbbg,
        time,
        repairCategory,
        repairStatus,
        timeExport,
        kcsVt,
        priority,
      ],
      "ALL",
      0,
      selectedOption
    );
    if (res && res.statusCode === 200) {
      listPoDetailSearch = res.data;
    }
    if (res && res.statusCode === 204) {
      listPoDetailSearch = res.data;
    }

    const exportData = [
      selectedColumns,
      ...listPoDetailSearch.map((item, index) => {
        return [
          // index + 1,
          ...selectedColumns.slice(0).map((column) => {
            if (column === "Tên thiết bị") {
              return item.product.productName;
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

    writeFile(workbook, "po-detail.xlsx");
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleSearch(0);
    }
  };

  return (
    <>
      <div className="tables">
        <div className="table-action">
          <div className="d-flex">
            {/* search po-detail */}
            <div className="row-search">
              <Row className="mb-1">
                <Form.Label className="text-center">
                  <b>Tìm kiếm</b>
                </Form.Label>
              </Row>
              <Row className="mb-3">
                <div className="d-flex ">
                  <div className="d-flex justify-content-center align-items-center w-product">
                    <Form.Label className="me-2">Mã hàng hóa</Form.Label>

                    <Form.Group
                      as={Col}
                      controlId="validationCustom01"
                      className="productid"
                    >
                      <Form.Control
                        required
                        type="text"
                        value={productId !== null ? productId : ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setProductId(value !== "" ? value : null);
                        }}
                        onKeyDown={(e) => handlePressEnter(e)}
                        placeholder="Mã hàng hóa"
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-center align-items-center w-serial ">
                    <Form.Label className="me-2 ms-4">Số serial</Form.Label>
                    <Form.Group
                      as={Col}
                      controlId="validationCustom01"
                      className="poNumber"
                    >
                      <Form.Control
                        required
                        type="text"
                        value={serialNumber !== null ? serialNumber : ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setSerialNumber(value !== "" ? value : null);
                        }}
                        onKeyDown={(e) => handlePressEnter(e)}
                        placeholder="Số serial"
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-center align-items-center w-po">
                    <Form.Label className="me-2 ms-4">Số PO</Form.Label>
                    <Form.Group
                      as={Col}
                      controlId="validationCustom01"
                      className="poNumber"
                    >
                      <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={
                          onSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                          onSuggestionsClearRequested
                        }
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={{
                          ...inputProps1,
                          className: "form-control second-autosuggest", // Thêm lớp CSS cho ô tìm kiếm thứ hai
                        }}
                      />
                    </Form.Group>
                  </div>
                </div>
              </Row>
              <Row className="mb-3">
                <div className="d-flex">
                  <div className="d-flex justify-content-center align-items-center w-product">
                    <Form.Label className="me-2 ">Số BBXK</Form.Label>

                    <Form.Group
                      as={Col}
                      controlId="validationCustom01"
                      className="bbxk"
                    >
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
                          onKeyDown={(e) => handlePressEnter(e)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-center align-items-center ">
                    <Form.Label className="me-2 ms-4">Cập nhật SC</Form.Label>
                    <Form.Group
                      as={Col}
                      controlId="validationCustom03"
                      className="repariStatus"
                    >
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(event) => {
                          const value = event.target.value;
                          setRepairStatus(value === "Tất cả" ? null : value);
                        }}
                      >
                        <option>Tất cả</option>
                        <option value="0">SC không được</option>
                        <option value="1">SC xong</option>
                        <option value="2">Cháy nổ</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-center align-items-center ">
                    <Form.Label className="me-1 ms-4">KCS</Form.Label>

                    <Form.Group
                      as={Col}
                      controlId="validationCustom03"
                      className="repariStatus"
                    >
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
                  </div>
                  <div className="d-flex justify-content-center align-items-center ">
                    <Form.Label className="me-1 ms-4">Ưu tiên</Form.Label>

                    <Form.Group
                      as={Col}
                      controlId="validationCustom05"
                      className="repariStatus"
                    >
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(event) => {
                          const value = event.target.value;
                          setPriority(value === "Tất cả" ? null : value);
                        }}
                      >
                        <option>Tất cả</option>
                        <option value="1">Ưu tiên</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Row>
              <Row className="mb-2">
                <div className="f-flex">
                  <Form.Group
                    as={Col}
                    controlId="validationCustom05"
                    className="d-flex justify-content-end"
                  >
                    <div>
                      <div className="search">
                        <button
                          className="btn btn-primary label-search"
                          onClick={() => handleSearch()}
                        >
                          <AiOutlineSearch className="icon-search" />
                          Search
                        </button>
                      </div>
                    </div>
                  </Form.Group>
                </div>
              </Row>
            </div>
            {/* S/n check */}
            <div className="row-sn">
              <Row className="mb-3">
                <Form.Label className="text-center">
                  <b>Serial Check</b>
                </Form.Label>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="validationCustomUsername8"
                  className="d-flex justify-content-center"
                >
                  <div className="import">
                    <label htmlFor="test9" className="btn btn-danger ">
                      <FaFileImport className="icon-import" />
                      S/N Check
                    </label>
                    <input
                      type="file"
                      onChange={handleImportSN}
                      id="test9"
                      hidden
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  controlId="validationCustomUsername8"
                  className="d-flex justify-content-center"
                >
                  <div className="update">
                    <button
                      className="btn btn-success btn-reset "
                      onClick={() => handleExportSN()}
                      disabled={!isExportButtonEnabledSN}
                    >
                      <AiOutlineDownload className="reset-icon" />
                      Export S/N
                    </button>
                  </div>
                </Form.Group>
              </Row>
            </div>
            {/* Barcode */}
            <div className="row-barcode">
              <Row className="mb-1">
                <Form.Label className="text-center">
                  <b>Barcode Check</b>
                </Form.Label>
              </Row>
              <Row className="mb-4">
                <Form.Group as={Col} controlId="validationCustomUsername2806">
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Barcode..."
                    value={barcodeScan}
                    onChange={(e) => setBarcodeScan(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-1 ">
                <Form.Group
                  as={Col}
                  controlId="validationCustomUsername8"
                  className="d-flex justify-content-end mt-3"
                >
                  <div className="update">
                    <button
                      className="btn btn-success label-export"
                      onClick={handleExportBarcode}
                      disabled={!isExportButtonEnabledBC}
                    >
                      <AiOutlineDownload className="icon-export" />
                      Export Barcode
                    </button>
                  </div>
                </Form.Group>
              </Row>
            </div>
            {/* kcsanalyst permission to display the export button */}
          </div>

          {/* button */}
          <div className="my-1 add-new d-flex justify-content-between mt-3">
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
              {localStorage.getItem("role") !== "ROLE_USER" && (
                <>
                  <div className="update update-btn">
                    <button
                      className="btn btn-success"
                      onClick={handleDownloadSampleFile}
                    >
                      Sample File
                    </button>
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
                  <div className="import">
                    <label
                      htmlFor="test99"
                      className="btn btn-warning label-import"
                    >
                      <FaFileImport className="icon-import" />
                      Update
                    </label>
                    <input
                      type="file"
                      onChange={handleUploadSC}
                      id="test99"
                      hidden
                    />
                  </div>
                  <div className="update">
                    <button
                      className="btn btn-success label-export"
                      onClick={handleExportSearch}
                      disabled={!isExportButtonEnabled}
                    >
                      <AiOutlineDownload className="icon-export" />
                      Export
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* table */}

        <table className="table-shadow  table-color  table-bordered table-hover">
          <thead>
            {(listPoDetail && listPoDetail.length > 0) ||
            (listPoDetailSN && listPoDetailSN.length > 0) ||
            (dataBarcode && dataBarcode.length > 0) ? (
              <tr>
                <th>Stt</th>
                <th>Mã HH</th>
                <th>Tên thiết bị</th>
                <th>Số serial</th>
                <th>Số PO</th>
                <th>Ngày NK</th>
                <th>Hạng mục SC</th>
                <th>Ưu tiên</th>
                <th>Cập nhật SC</th>
                <th>Số BBXK</th>
                <th>Cập nhật XK</th>
                <th>KCS</th>
                <th>Cập nhật BH</th>
                <th>Ghi chú</th>
                {dataBarcode && dataBarcode.length > 0 && (
                  <th className="text-center">Action</th>
                )}
              </tr>
            ) : null}
          </thead>
          <tbody>
            {/* search PO detail */}
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
                    onDoubleClick={() => handleEditPoDetail(item)}
                    style={rowStyle}
                    className="table-striped"
                  >
                    <td>{currentIndex + 1}</td>
                    <td>{item.product.productId}</td>
                    <td className="col-name-product">
                      {item.product.productName}
                    </td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Hàng SC"}
                      {item.repairCategory === 1 && "Hàng BH"}
                    </td>
                    <td>{item.priority === 1 && "Ưu tiên"}</td>
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
                  </tr>
                );
              })}

            {/* S/N check PO Detail */}
            {listPoDetailSN &&
              listPoDetailSN.length > 0 &&
              listPoDetailSN.map((item, index) => {
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
                    // onDoubleClick={() => handleEditPoDetail(item)}
                    style={rowStyle}
                    className="table-striped"
                  >
                    <td>{currentIndex + 1}</td>
                    <td>{item.product.productId}</td>
                    <td className="col-name-product">
                      {item.product.productName}
                    </td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Hàng SC"}
                      {item.repairCategory === 1 && "Hàng BH"}
                    </td>
                    <td>{item.priority === 1 && "Ưu tiên"}</td>
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
                  </tr>
                );
              })}

            {/* Barcode check */}
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

                return (
                  <tr
                    key={`sc-${index}`}
                    style={rowStyle(item)}
                    className="table-striped"
                  >
                    <td>{index + 1}</td>
                    <td>{item.product.productId}</td>
                    <td className="col-name-product">
                      {item.product.productName}
                    </td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Hàng SC"}
                      {item.repairCategory === 1 && "Hàng BH"}
                    </td>
                    <td>{item.priority === 1 && "Ưu tiên"}</td>
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
        {listPoDetail && listPoDetail.length > 0 && (
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
              <option value="500">1000 / Trang</option>
              <option value="2000">5000 / Trang</option>
            </Form.Select>
          </div>
        )}
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
          handleSearch={handleSearch}
          currentPageSearch={currentPageSearch}
          productIds={productId}
          serialNumbers={serialNumber}
          value1s={value1}
          bbbgs={bbbg}
          selectedDateStarts={selectedDateStart}
          repairCategorys={repairCategory}
          repairStatuss={repairStatus}
          exportPartners={exportPartner}
          kcsVts={kcsVt}
          prioritys={priority}
          items={item}
          searchByPO={searchByPO}
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
