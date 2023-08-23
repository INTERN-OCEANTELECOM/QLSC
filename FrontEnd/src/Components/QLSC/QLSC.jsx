import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import { read, utils, writeFile } from "xlsx";
import "./qlsc.scss";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import { Modal, Button, Row, InputGroup, Spinner, Alert } from "react-bootstrap";
import {
  fecthAllPoDetail,
  getAllPoDetail,
  getPo,
  getProductName,
  importPODetail,
  relateRepairHistory,
  saveAllRepair,
  searchPODetail,
  searchRepairHistory,
  searchSerialNumber,
  updatePoDetail,
  updateStatusPoDetail,
  writeAllNK,
  writeAllXK,
} from "../../service/service";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ModalUpdatePoDetail from "../Modal/PO_DETAIL/ModalUpdate/ModalUpdatePoDetail";
import ModalShowPoDetail from "../Modal/PO_DETAIL/ModalShow/ModalShowPoDetail";
import ModalDeletePODetail from "../Modal/PO_DETAIL/ModalDelete/ModalDeletePODetail";
import Autosuggest from "react-autosuggest";
import useScanDetection from "use-scan-detection";
import ReactDatePicker from "react-datepicker";

const ItemContext = React.createContext(null);

const QLSC = () => {
  const [listPoDetail, setListPoDetail] = useState([]);
  const [listRepair, setListRepair] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedOption, setSelectedOption] = useState("1000");
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [repairPerson, setRepairPerson] = useState(null);
  const [repairError, setRepairError] = useState(null);
  const [poNumber, setPoNumber] = useState(null);
  const [bbbg, setBbbg] = useState(null);
  const [importDate, setImportDate] = "";
  const [repairCategory, setRepairCategory] = useState(null);
  const [repairStatus, setRepairStatus] = useState(null);
  const [exportPartner, setExportPartner] = useState(null);
  const [kcsVt, setKcsVt] = useState(null);
  const [listPo, setListPo] = useState("");
  const [priority, setPriority] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [value1, setValue1] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const item = JSON.parse(queryParams.get("item"));
  const [isExportButtonEnabled, setIsExportButtonEnabled] = useState(false);
  const [flag, setFlag] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State để kiểm soát việc hiển thị popup
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showReceiveRow, setShowReceiveRow] = useState(false);
  const [showSaveAll, setShowSaveAll] = useState(false)
  const [showCancel, setShowCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listProductName, setListProductName] = useState([])
  const [suggestionsName, setSuggestionsName] = useState([]);
  const inputRef = useRef(null);
   const [previousData, setPreviousData] = useState([]);

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
      priority ||
      productName||
      repairPerson||
      repairError
    ) {
      if (item) {
        searchByPO(0);
        setValue1(item);
      } else {
        handleSearchHistoryRepair();
      }
    } else {
      getAllPO();
      getNameProduct()
      // getProducts(0)
    }
  }, [selectedOption]);

   useEffect(() => {
     document.addEventListener("click", handleClickOutside);
     return () => {
       document.removeEventListener("click", handleClickOutside);
     };
   }, []);

   const handleClickOutside = (event) => {
     if (inputRef.current && !inputRef.current.contains(event.target)) {
       setSuggestionsName([]); // Ẩn gợi ý khi click ra ngoài
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

  const getNameProduct = async () => {
    let res = await getProductName()
    if(res && res.statusCode === 200) {
      setListProductName(res.data)
    }
  }
  
  // Search

  const handleSearchHistoryRepair = async () => {
    setSuggestionsName([])
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
      poItem = item.trim();
    } else {
      if (value1 === "") {
        poItem = null;
      } else {
        poItem = value1.trim();
      }
    }

    let person 
    if(repairPerson === null) {
      person = null
    } else {
      person = repairPerson.trim() + "@daiduongtelecom.com"
    }
    let serial = serialNumber === null ? null : serialNumber.trim()
    let nameProduct = productName === null ? null :productName === "" ? null : productName.trim()
    setIsLoading(true);
    if (nameProduct === null && serial === null && poItem === null) {
      toast.error("Cần nhập tối thiểu một trong 3 trường tên, số serial hoặc để tìm kiếm")
      setIsLoading(false);
      return
    } else {
      let res = await searchRepairHistory(
        [nameProduct, serial, poItem, person, repairError],
        "ALL",
        0,
        selectedOption
      );
      if (res && res.statusCode === 200) {
        setIsLoading(false);
        const resultList = [];
        res.data.forEach((dataItem, dataIndex) => {
          if (dataItem.repairHistories && dataItem.repairHistories.length > 0) {
            dataItem.repairHistories.forEach((history, historyIndex) => {
              const resultItem = {
                dataIndex: dataIndex + 1,
                historyIndex: historyIndex + 1,
                id: dataItem.id,
                po: {
                  poNumber: dataItem.po.poNumber,
                },
                poDetailId: dataItem.poDetailId,
                product: {
                  productName: dataItem.product.productName,
                },

                amountInPo: dataItem.amountInPo,
                remainingQuantity: dataItem.remainingQuantity,
                serialNumber: dataItem.serialNumber,
                repairHistories: {
                  id: history.id,
                  accessory: history.accessory,
                  creator: history.creator,
                  module: history.module,
                  repairDate: history.repairDate,
                  repairError: history.repairError,
                  repairResults: history.repairResults,
                },
              };

              resultList.push(resultItem);
            });
          } else {
            resultList.push(dataItem);
          }
        });
        setListPoDetail(resultList);
        setTotalProducts(res.totalPages);
        setTotalPages(res.data.number);
        // setCurrentPageSearch(page);
        setIsExportButtonEnabled(true);
      }
      if (res && res.statusCode === 204) {
        setListPoDetail(res.data);
        setTotalProducts(res.totalPages);
        // setCurrentPageSearch(page);
        setIsExportButtonEnabled(false);
        toast.warning("Dữ liệu không tồn tại!!!");
        setIsLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null); // Đặt lại thông tin dữ liệu cần xóa
    setShowConfirmation(false); // Đóng popup xác nhận
  };
 
  // handle reset
  const handleReset = () => {
    window.location.reload();
    window.location.href = `/quan-li-sua-chua`;
  };

  const handleInputChangeName = (event) => {
    const value = event.target.value;
    setProductName(value);

    if (value === "") {
      setSuggestionsName([]); // Ẩn gợi ý khi ô input trống
    } else {
      // Lọc và hiển thị gợi ý
      const filteredSuggestions = listProductName.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionsName(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setProductName(suggestion);
    setSuggestionsName([]);
  };

  const onChange1 = (event, { newValue }) => {
    setValue1(newValue); // Cập nhật giá trị ô tìm kiếm
  };

  const getSuggestions = (inputValue) => {
    const inputValues = inputValue.trim().split(" ");
    const lastValue = inputValues[inputValues.length - 1].toLowerCase();
    const filteredSuggestions = listPo.filter((item) =>
      item.poNumber.toLowerCase().includes(lastValue)
    );
    return filteredSuggestions;
  };

  const getSuggestionValue = (suggestion) => suggestion.poNumber;

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = suggestion.poNumber;
    const matchIndex = suggestionText
      .toLowerCase()
      .indexOf(query.toLowerCase());
    const matchStart = matchIndex >= 0 ? matchIndex : suggestionText.length;
    const matchEnd = matchStart + query.length;
    const beforeMatch = suggestionText.slice(0, matchStart);
    const match = suggestionText.slice(matchStart, matchEnd);
    const afterMatch = suggestionText.slice(matchEnd);
    return (
      <div>
        {beforeMatch}
        <strong>{match}</strong>
        {afterMatch}
      </div>
    );
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedSuggestion(suggestion);
    setValue1((prevValue) => {
      const inputValues = prevValue.trim().split(" ");
      const newValue =
        inputValues.slice(0, -1).join(" ") + " " + suggestion.poNumber + " ";
      return newValue;
    });
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchHistoryRepair();
    }
  };

  const inputProps1 = {
    placeholder: "Nhập PO",
    value: value1,
    onChange: onChange1,
    onKeyDown: onKeyDown,
  };

  const handleExportSearch = async () => {
    console.log(flag);
    let selectedColumns = [
      "Ngày sửa chữa",
      "Số lượng PO",
      "Số lượng còn lại",
      "Sản phẩm sửa chữa",
      "Số serial",
      "Số PO",
      "Lỗi chính trước sửa chữa",
      "Khối sửa chữa",
      "Linh kiện sửa chữa",
      "Kết quả sửa chữa",
      "Người sửa chữa",
    ];

    let time = selectedDateStart;
    let timeExport = exportPartner;
    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    if (exportPartner !== null) {
      timeExport = moment(exportPartner).format("DD/MM/YYYY");
    }

    const exportData = [
      selectedColumns,
      ...listPoDetail.map((item, index) => {
        return [
          // index + 1,
          ...selectedColumns.slice(0).map((column) => {
            if (column === "Ngày sửa chữa") {
              let data;
              if (item.repairHistories.repairDate) {
                data = moment(item.repairHistories.repairDate).format(
                  "DD/MM/YYYY HH:mm"
                );
              } else {
                data = null;
              }

              return data
            }
            if (column === "Số lượng PO") {
              return item.amountInPo;
            }
            if (column === "Số lượng còn lại") {
              return item.remainingQuantity;
            }
            if (column === "Sản phẩm sửa chữa") {
              const formattedProductName = formatProductName(
                item.product.productName
              );
              return formattedProductName;
            }
            if (column === "Số serial") {
              return item.serialNumber;
            }
            if (column === "Số PO") {
              return item.po.poNumber;
            }
            if (column === "Lỗi chính trước sửa chữa") {
              return item.repairHistories.repairError;
            }
            if (column === "Khối sửa chữa") {
              return item.repairHistories.module;
            }
            if (column === "Linh kiện sửa chữa") {
              return item.repairHistories.accessory;
            }
            if (column === "Kết quả sửa chữa") {
              return item.repairHistories.repairResults;
            }
            if (column === "Người sửa chữa") {
              let nameRepair;
              if (item.repairHistories.creator) {
                nameRepair = item.repairHistories.creator.replace(
                  "@daiduongtelecom.com",
                  ""
                );
              } else {
                nameRepair = null;
              }
              return nameRepair;
            }
          }),
        ];
      }),
    ];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(exportData);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "quan-li-sua-chua.xlsx");
  };

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleSearchHistoryRepair();
    }
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
  
  const handleReceive = async(item) => {
    setListRepair([])
    setShowReceiveRow(true)
    let repairHistoryId; 
    if (item.repairHistories.id) {
      repairHistoryId = item.repairHistories.id;
    } else {
      repairHistoryId = null;
    }
    let res = await relateRepairHistory(item.poDetailId, repairHistoryId);
    if (res && res.statusCode === 200) {
      console.log(res.data);
       const updatedData = res.data.map((repairItem) => ({
         ...repairItem,
         poDetail: {
           id: item.id,
           poDetailId: item.poDetailId,
           product: {
             productName: item.product.productName,
           },
         },
         serialNumber: item.serialNumber,
         po: {
           poNumber: item.po.poNumber,
         },

         amountInPo: item.amountInPo,
         remainingQuantity: item.remainingQuantity,

         repairDate:
           repairItem.repairDate === null
             ? new Date().getTime()
             : repairItem.repairDate,
         creator:
           repairItem.creator === null
             ? localStorage.getItem("email")
             : repairItem.creator,
         repairResults:
           repairItem.repairResults === null
             ? "DANG_SC"
             : repairItem.repairResults,
         module: repairItem.module,
         accessory: repairItem.accessory,
         repairError: repairItem.repairError,
       }));
      setListRepair(updatedData);
      setTotalProducts(res.totalPages);
      setTotalPages(res.data.number);
      // setCurrentPageSearch(page);
      setIsExportButtonEnabled(true);
    }
    if (res && res.statusCode === 204) {
      setListRepair(res.data);
      setTotalProducts(res.totalPages);
      // setCurrentPageSearch(page);
      setIsExportButtonEnabled(false);
      toast.warning("Dữ liệu không tồn tại!!!");
    }
  }

  const handleCancel = () => {
    setShowReceiveRow(false);
    setListRepair([]);
    handleClose()
  }

  const handleAddRow = (item) => {
    const newRow = {
      id: null,
      poDetail: {
        id: item.poDetail.id,
        poDetailId: item.poDetail.poDetailId,
        product: {
          productName: item.poDetail.product.productName,
        },
      },
      serialNumber: item.serialNumber,
      po: {
        poNumber: item.po.poNumber,
      },
      amountInPo: item.amountInPo,
      remainingQuantity: item.remainingQuantity,
      repairDate: new Date().getTime(),
      creator: localStorage
        .getItem("email"),
      repairResults: "DANG_SC",
    };

    setListRepair([...listRepair, newRow]);
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listRepair];
    updatedList.splice(index, 1);

    setListRepair(updatedList);
  };

  const handleInputChange = (index, field, value) => {
    const updatedList = [...listRepair];
    updatedList[index][field] = value;

    setListRepair(updatedList);

    const updatedPreviousData = [...previousData];
    updatedPreviousData[index] = value;
    setPreviousData(updatedPreviousData);
  };

  const saveAll = () => {
    setShowSaveAll(true)
  }

  const cancel = () => {
    setShowCancel(true)
  }

  const saveAllRepairHistory = async() => {
    let res = await saveAllRepair(listRepair)
    console.log(res)
    if(res && res.statusCode === 200) {
      toast.success("Lưu thành công!!!")
      setListRepair([])
      handleSearchHistoryRepair()
      handleClose()
    } else {
      if(res && res.statusCode === 205) {
        toast.error("Lưu không thành công do PO đã kết thúc!!!!")
        handleClose()
      } else {
        toast.error("Lưu không thành công !!!!");
        handleClose();
      }
    }
  }

  const handleClose = () => {
    setShowSaveAll(false)
    setShowCancel(false)
  }

  
  return (
    <>
      {localStorage.getItem("role") !== "ROLE_QLPO" ? (
        <>
          <div className="tables-qlsc">
            <div className="table-action">
              <div className="d-flex">
                {/* search po-detail */}
                <div className="row-search-qlsc">
                  <Row className="mb-2">
                    <div className="d-flex ">
                      <div className="d-flex justify-content-center align-items-center w-product">
                        <Form.Label className="me-1">Tên thiết bị</Form.Label>
                        <Form.Group
                          as={Col}
                          controlId="validationCustom01"
                          className="productid"
                        >
                          <Form.Control
                            required
                            ref={inputRef}
                            type="text"
                            value={productName !== null ? productName : null}
                            onChange={handleInputChangeName}
                            onKeyDown={(e) => handlePressEnter(e)}
                            placeholder="Tên thiết bị"
                          />
                          {suggestionsName.length > 0 && (
                            <ul className="suggestions-list">
                              {suggestionsName.map((suggestion, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                        </Form.Group>
                      </div>
                      <div className="d-flex justify-content-center align-items-center w-product ">
                        <Form.Label className="me-2 ms-4">Số serial</Form.Label>
                        <Form.Group
                          as={Col}
                          controlId="validationCustom01"
                          className="poNumber"
                        >
                          <Form.Control
                            required
                            type="text"
                            value={serialNumber !== null ? serialNumber : null}
                            onChange={(event) => {
                              const value = event.target.value;
                              setSerialNumber(value !== "" ? value : null);
                            }}
                            onKeyDown={(e) => handlePressEnter(e)}
                            placeholder="Số serial"
                          />
                        </Form.Group>
                      </div>
                      <div className="d-flex justify-content-center align-items-center w-product">
                        <Form.Label className="me-1 ms-3">Số PO</Form.Label>
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
                            onSuggestionSelected={onSuggestionSelected}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                              ...inputProps1,
                              className: "form-control second-autosuggest", // Thêm lớp CSS cho ô tìm kiếm thứ hai
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="d-flex justify-content-center align-items-center w-product">
                        <Form.Label className="me-1 ms-3">KQ SC</Form.Label>
                        <Form.Group
                          as={Col}
                          controlId="validationCustom03"
                          className="repariStatus"
                        >
                          <Form.Select
                            aria-label="Default select example"
                            className="me-5"
                            value={
                              repairError === null ? "Tất cả" : repairError
                            }
                            onChange={(event) => {
                              const value = event.target.value;
                              setRepairError(value === "Tất cả" ? null : value);
                            }}
                          >
                            <option>Tất cả</option>
                            <option value="DANG_SC">Đang SC</option>
                            <option value="CHAY_NO">Cháy nổ</option>
                            <option value="OK">SC OK</option>
                            <option value="FAIL">FAIL</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>

              {/* button */}
              <div className="my-1 add-new d-flex justify-content-between mt-3">
                <div className="col-3">
                  {localStorage.getItem("role") === "ROLE_ADMIN" ||
                    localStorage.getItem("role") === "ROLE_MANAGER" ? (
                      <div className="d-flex justify-content-center align-items-center w-repair ">
                        <Form.Label className="me-2 ms-2">Repairman</Form.Label>
                        <InputGroup
                          as={Col}
                          controlId="validationCustom01"
                          className="poNumber d-flex"
                        >
                          <Form.Control
                            required
                            type="text"
                            value={repairPerson !== null ? repairPerson : ""}
                            onChange={(event) => {
                              const value = event.target.value;
                              setRepairPerson(value !== "" ? value : null);
                            }}
                            onKeyDown={(e) => handlePressEnter(e)}
                            placeholder="Repairman"
                          />
                          <InputGroup.Text id="basic-addon2">
                            @daiduongtelecom.com
                          </InputGroup.Text>
                        </InputGroup>
                      </div>
                    ) : null}
                </div>
                <div className="group-btn d-flex">
                  {/* button search */}
                  <div className="search">
                    <button
                      className="btn btn-primary label-search"
                      onClick={() => handleSearchHistoryRepair()}
                    >
                      <AiOutlineSearch className="icon-search" />
                      Search
                    </button>
                  </div>
                  <div className="search">
                    <button
                      className="btn btn-primary label-search"
                      onClick={() => handleReset()}
                    >
                      Reset
                    </button>
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
                </div>
              </div>
            </div>
            <div className="table-history-qlsc">
              <div>
                <div className="mt-2">
                  <h6>Lịch sử SC</h6>
                </div>
                <div className="table-qlsc">
                  <Table striped bordered hover>
                    <thead>
                      <tr className="table-header-qlsc">
                        <th>Ngày SC</th>
                        <th>SL PO</th>
                        <th>SL Còn lại</th>
                        <th>Sản phẩm sửa chữa</th>
                        <th>Số serial</th>
                        <th>Số PO</th>
                        <th>Lỗi chính trước SC</th>
                        <th>Khối SC</th>
                        <th>Linh kiện SC</th>
                        <th>KQ SC</th>
                        <th>User Action</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listPoDetail &&
                        listPoDetail.length > 0 &&
                        listPoDetail.map((item, index) => {
                          let data;
                          if (item.repairHistories.repairDate) {
                            data = moment(
                              item.repairHistories.repairDate
                            ).format("DD/MM/YYYY HH:mm");
                          } else {
                            data = null;
                          }
                          const formattedProductName = formatProductName(
                            item.product.productName
                          );
                          let nameRepair;
                          if (item.repairHistories.creator) {
                            nameRepair = item.repairHistories.creator.replace(
                              "@daiduongtelecom.com",
                              ""
                            );
                          } else {
                            nameRepair = null;
                          }
                          return (
                            <tr key={`scc-${index}`}>
                              <td className="col-date">{data}</td>
                              <td className="col-po-amount">
                                {item.amountInPo}
                              </td>
                              <td className="col-po-remain">
                                {item.remainingQuantity}
                              </td>
                              <td className="col-name-product">
                                {formattedProductName}
                              </td>
                              <td>{item.serialNumber}</td>
                              <td>{item.po.poNumber}</td>
                              <td className="col-name-product">
                                {item.repairHistories.repairError}
                              </td>
                              <td className="col-name-product">
                                {item.repairHistories.module}
                              </td>
                              <td className="col-name-product">
                                {item.repairHistories.accessory}
                              </td>
                              <td>{item.repairHistories.repairResults}</td>
                              <td className="col-repairman">{nameRepair}</td>
                              <td className="col-button-qlsc">
                                {localStorage.getItem("role") ===
                                  "ROLE_ADMIN" ||
                                localStorage.getItem("role") === "ROLE_QLSC" ||
                                localStorage.getItem("role") ===
                                  "ROLE_MANAGER" ? (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleReceive(item)}
                                  >
                                    Tiếp nhận
                                  </button>
                                ) : null}
                                {/* <button className="btn btn-warning btn-sm ms-2">
                            Edit
                          </button> */}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2 align-items-center">
                  <h6>Cập nhật hoạt động SC</h6>
                  <div>
                    {localStorage.getItem("role") === "ROLE_ADMIN" ||
                    localStorage.getItem("role") === "ROLE_QLSC" ||
                    localStorage.getItem("role") === "ROLE_MANAGER" ? (
                      <>
                        <button className="btn btn-primary" onClick={saveAll}>
                          Save All
                        </button>
                        {/* <button className="btn btn-primary ms-2" onClick={saveAll}>
                Thêm dòng
              </button> */}
                        <button
                          className="btn btn-warning ms-2"
                          onClick={cancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="table-update-qlsc">
                  <table className="table-shadow  table-repair  table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Ngày SC</th>
                        <th>SL PO</th>
                        <th>SL Còn lại</th>
                        <th>Sản phẩm sửa chữa</th>
                        <th>Số serial</th>
                        <th>Số PO</th>
                        <th>Lỗi chính trước SC</th>
                        <th>Khối SC</th>
                        <th>Linh kiện SC</th>
                        <th>KQ SC</th>
                        <th>User Action</th>
                        <th className="text-center col-action-repair">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {showReceiveRow &&
                        listRepair &&
                        listRepair.length > 0 &&
                        listRepair.map((item, index) => {
                          const time = item.repairDate;
                          const data = moment(time).format("DD/MM/YYYY HH:mm");
                          const isIndexZero = index === 0;
                          let isUserAllowedToEdit =
                            localStorage.getItem("email") === item.creator;
                          if (item.creator === null || item.creator === "") {
                            isUserAllowedToEdit = true;
                          } else if (
                            localStorage.getItem("email") === item.creator
                          ) {
                            isUserAllowedToEdit = true;
                          } else {
                            isUserAllowedToEdit = false;
                          }
                          return (
                            <tr
                              key={`scu-${index}`}
                              className={isIndexZero ? "highlight-row" : ""}
                            >
                              <td>{data}</td>
                              <td className="col-po-amount">
                                {item.amountInPo}
                              </td>
                              <td className="col-po-remain">
                                {item.remainingQuantity}
                              </td>
                              <td className="col-name-product">
                                {formatProductName(
                                  item.poDetail.product.productName
                                )}
                              </td>
                              <td>{item.serialNumber}</td>
                              <td>{item.po.poNumber}</td>
                              {isUserAllowedToEdit ? (
                                <>
                                  <td>
                                    <input
                                      type="text"
                                      className="no-border-input"
                                      value={item.repairError}
                                      onChange={(e) =>
                                        handleInputChange(
                                          index,
                                          "repairError",
                                          e.target.value
                                        )
                                      }
                                      list={`suggestions-${index}`} // Add a list attribute
                                    />
                                    {/* Add datalist for suggestions */}
                                    <datalist id={`suggestions-${index}`}>
                                      {previousData.map((data, idx) => (
                                        <option
                                          key={`suggestion-${idx}`}
                                          value={data}
                                        />
                                      ))}
                                    </datalist>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="no-border-input"
                                      value={item.module}
                                      onChange={(e) =>
                                        handleInputChange(
                                          index,
                                          "module",
                                          e.target.value
                                        )
                                      }
                                      list={`suggestions-${index}`} // Add a list attribute
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="no-border-input"
                                      value={item.accessory}
                                      onChange={(e) =>
                                        handleInputChange(
                                          index,
                                          "accessory",
                                          e.target.value
                                        )
                                      }
                                      list={`suggestions-${index}`}
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className="no-border-input"
                                      aria-label="Default select example"
                                      value={item.repairResults}
                                      onChange={(event) =>
                                        handleInputChange(
                                          index,
                                          "repairResults",
                                          event.target.value
                                        )
                                      }
                                    >
                                      <option value="DANG_SC">Đang SC</option>
                                      <option value="OK">SC OK</option>
                                      <option value="CHAY_NO">Cháy nổ</option>
                                      <option value="FAIL">FAIL</option>
                                    </select>
                                  </td>
                                </>
                              ) : (
                                // Hiển thị các ô không thể chỉnh sửa
                                <>
                                  <td className="col-display-non-input">
                                    {item.repairError}
                                  </td>
                                  <td className="col-display-non-input">
                                    {item.module}
                                  </td>
                                  <td className="col-display-non-input">
                                    {item.accessory}
                                  </td>
                                  <td className="col-display-non-input-1">
                                    {item.repairResults}
                                  </td>
                                </>
                              )}
                              <td className="col-repairman">
                                {item.creator.replace(
                                  "@daiduongtelecom.com",
                                  ""
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteRow(index)}
                                >
                                  Xóa dòng
                                </button>
                                <button
                                  className="btn btn-primary btn-sm ms-1"
                                  onClick={() => handleAddRow(item)}
                                >
                                  Thêm dòng
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Modal show={showSaveAll} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Save all</Modal.Title>
              </Modal.Header>
              <Modal.Body>Bạn có chắc muốn lưu tất cả không?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={saveAllRepairHistory}>
                  Save All
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showCancel} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Cancel</Modal.Title>
              </Modal.Header>
              <Modal.Body>Bạn có chắc muốn hủy không?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleCancel}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>

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
          </div>
        </>
      ) : (
        <>
          <Alert variant="danger" className=" error-login">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>Bạn không có quyền truy cập</p>
          </Alert>
        </>
      )}
    </>
  );
};

export default QLSC;
