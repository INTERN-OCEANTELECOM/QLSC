import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { FaFileImport } from "react-icons/fa";
import {  utils, writeFile } from "xlsx";
import ReactPaginate from "react-paginate";
import "./product.scss";
import _ from "lodash";
import { Modal, Button, Alert, NavDropdown } from "react-bootstrap";
import { fecthAll, getAllProduct, searchProduct } from "../../service/service";
import {  FaFileExport } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import Form from "react-bootstrap/Form";
import ModalShowProduct from "../Modal/PRODUCT/ModalShowProduct/ModalShowProduct";
import ModalAddProduct from "../Modal/PRODUCT/ModalAddProduct/ModalAddProduct";

const Product = () => {
  const [listHH, setListHH] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [isShowProductDetail, setIsShowProductDetail] = useState(false);
  const [data, setData] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [search, setSearch] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [dataDetail, setDataDetail] = useState("");
  const [selectedOption, setSelectedOption] = useState("50");
  const [isShowAddProduct, setIsShowAddProduct] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState("")
  const [currentPageSearch, setCurrentPageSearch] = useState("")
  const [sortedListHH, setSortedListHH] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  // call api when load page
  useEffect(() => {
    if (search) {
      handleSearch(0);
    } else {
      getProducts(0);
      getAllProducts();
    }
  }, [selectedOption]);

  useEffect(() => {
    const sortedList = _.orderBy(listHH, ["productName"], [sortDirection]);
    setSortedListHH(sortedList);
  }, [listHH, sortDirection]);

  // call api get all product by page
  const getProducts = async (page) => {
    try {
      let res = await fecthAll(page, selectedOption);
      if (res && res.data) {
        setListHH(res.data);
        setTotalProducts(res.totalPages);
        setTotalPages(res.data.number);
      }
    } catch (error) {
      setLoadingMessage("Lỗi khi tải dữ liệu.");
    }
  };
  // call api get all product
  const getAllProducts = async () => {
    let res = await getAllProduct();
    if (res && res.data) {
      setDataExport(res.data);
    }
  };

  // Page
  const itemsPerPage = selectedOption;
  const handlePageClick = async (event) => {
    const selectedPage = event.selected;
    const newStartIndex = selectedPage * itemsPerPage;
    setStartIndex(newStartIndex);
    if (search) {
      handleSearch(+event.selected);
      setCurrentPageSearch(selectedPage)
    } else {
      getProducts(+event.selected);
      setCurrentPage(selectedPage)
    }
  };

  // Export notify error when import
  const handleExportNotify = () => {
    const columnHeader = ["Loại lỗi", "Số hàng", "Mô tả lỗi"];
    const dataArray = [columnHeader, ...data.map((obj) => Object.values(obj))];
    console.log(data);
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "mo_ta_san_pham.xlsx");
  };

  // Export
  const handleExport = () => {
    const columnHeader = ["Mã hàng hóa", "Tên thiết bị","Nhóm thiết bị", "Thống kê SL"];
    const exportData = [
      columnHeader,
      ...dataExport.map((item, index) => {
        return [
          // index + 1,
          ...columnHeader.slice(0).map((column) => {
            if (column === "Tên thiết bị") {
              const formattedProductName = formatProductName(item.productName);
              return formattedProductName;
            }
            if (column === "Mã hàng hóa") {
              return item.productId;
            }
            if (column === "Nhóm thiết bị") {
              if (item.productGroup !== null) {
                return item.productGroup.groupName;
              } 
            }
            if (column === "Thống kê SL") {
              return item.amount;
            }
          }),
        ];
      }),
    ];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(exportData);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "thiet_bi.xlsx");
  };

  const handleCloses = () => {
    setIsShowNotify(false);
    setIsShowProductDetail(false);
    setIsShowAddProduct(false);
  };

  // Search
  const handleSearch = async (page) => {
    if (search) {
      try {
        const res = await searchProduct([search], "ALL", page, itemsPerPage);
        if (res && res.data) {
          setListHH(res.data);
          setTotalProducts(res.totalPages);
          setTotalPages(res.totalPages);
          setCurrentPageSearch(page);
        } else {
          if(res && res.statusCode === 204) {
            setListHH(res.data);
            setCurrentPageSearch(page);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      getProducts(0);
    }
  };

  const handleShowProductDetail = (product) => {
    setIsShowProductDetail(true);
    setDataDetail(product);
  };

  const handleReset = () => {
    getProducts(0)
    setSearch("")
    window.location.reload();
  }

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleSearch(0);
    }
  };

  const formatProductName = (name) => {
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

  return (
    <>
      {localStorage.getItem("role") !== "ROLE_QLSC" ? (
        <>
          <div className="product">
            {/* button */}

            <div className="my-3 add-new d-flex justify-content-between flex-wrap">
              <div className="col-6 d-flex">
                <div className="col-6">
                  <div className="btn-search input-group w-100">
                    <input
                      className="form-control"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => handlePressEnter(e)}
                    />
                    <button
                      className="btn1 btn-primary1"
                      onClick={() => handleSearch()}
                    >
                      <AiOutlineSearch />
                    </button>
                  </div>
                </div>
                <div className="update-po col-2 mx-2">
                  <button
                    className="btn1 btn-primary1 btn-reset "
                    onClick={() => handleReset()}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="group-btn d-flex">
                {localStorage.getItem("role") === "ROLE_MANAGER" ||
                localStorage.getItem("role") === "ROLE_ADMIN" ||
                localStorage.getItem("role") === "ROLE_QLPO" ? (
                  <>
                    <div className="import">
                      <button
                        htmlFor="test"
                        className="btn btn-danger label-import"
                        onClick={() => setIsShowAddProduct(true)}
                      >
                        <FaFileImport className="icon-import" />
                        Add new
                      </button>
                    </div>
                  </>
                ) : null}
                <div className="export">
                  <button
                    htmlFor="test"
                    className="btn btn-success label-import export-btn"
                    onClick={handleExport}
                  >
                    <FaFileExport className="icon-export" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* table */}

            <Table
              striped
              bordered
              hover
              className="table-shadow responsive-table"
            >
              <thead>
                <tr>
                  <th>Stt</th>
                  <th>Mã thiết bị</th>
                  <th>Tên thiết bị</th>
                  <th className="col-group-name">
                    Nhóm thiết bị
                    {/* <NavDropdown
                      title="Nhóm thiết bị"
                      id="basic-nav-dropdown"
                      className="float-start"
                    >
                      <NavDropdown.Item href="#action/3.1">
                        Card phụ trợ thiết bị vô tuyến
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">
                        Card xử lí chính thiết bị vô tuyến
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">
                        Sửa chữa thiết bị truyền dẫn và CĐBR
                      </NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.4">
                        Sửa chữa thiết bị cơ điện
                      </NavDropdown.Item>
                    </NavDropdown> */}
                  </th>
                  <th className="col-amount">Thống kê SL</th>
                </tr>
              </thead>
              <tbody>
                {sortedListHH &&
                  sortedListHH.length > 0 &&
                  sortedListHH.map((item, index) => {
                    const currentIndex = startIndex + index;
                    const formattedProductName = formatProductName(
                      item.productName
                    );

                    const group =
                      item.productGroup !== null
                        ? item.productGroup.groupName
                        : "Chưa cập nhật";
                    return (
                      <tr
                        key={`sc-${currentIndex}`}
                        onDoubleClick={() => handleShowProductDetail(item)}
                      >
                        <td>{currentIndex + 1}</td>
                        <td>{item.productId}</td>
                        <td>{formattedProductName}</td>
                        <td>{group}</td>
                        <td className="col-amount-sl">{item.amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>

            {/* Phân trang */}

            <div className="page-size ">
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
                <option value="50">50 / Trang</option>
                <option value="75">75 / Trang</option>
                <option value="100">100 / Trang</option>
              </Form.Select>
            </div>

            {/* Modal */}

            <ModalAddProduct
              show={isShowAddProduct}
              handleCloses={handleCloses}
              getProducts={getProducts}
              currentPage={currentPage}
            />

            <ModalShowProduct
              show={isShowProductDetail}
              handleClose={handleCloses}
              dataDetail={dataDetail}
              getProducts={getProducts}
              currentPage={currentPage}
              search={search}
              handleSearch={handleSearch}
              currentPageSearch={currentPageSearch}
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

export default Product;
