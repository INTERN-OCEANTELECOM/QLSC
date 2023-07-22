import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./po.scss";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import ModelAddPO from "../Modal/PO/ModalAddPO/ModelAddPO";
import ModalUpdatePo from "../Modal/PO/ModalUpdate/ModalUpdatePo";
import { getAllPO, getPo, searchPO } from "../../service/service";
import moment from "moment";
import { Link } from "react-router-dom";
import ModalShowPO from "../Modal/PO/ModalShow/ModalShowPO";
import ModalShowPOStatistical from "../Modal/PO/ModalShow/ModalShowPOStatistical";
import logo from "../../assets/logo_28-06-2017_LogoOceanTelecomtailieupng-removebg-preview.png";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const PO = () => {

  const [isShowAddPO, setIsShowAddPO] = useState(false);
  const user = useSelector((state) => state.user.account);
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [isShowPODetail, setIsShowPODetail] = useState(false);
  const [listPo, setListPo] = useState("");
  const [dataPo, setDataPo] = useState("");
  const [sortedListPo, setSortedListPo] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("poNumber");
  const [statistical, setStatistical] = useState(false);
  const [dataStatistical, setDataStatistical] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("")
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedOption, setSelectedOption] = useState("50");
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState("");
  const [currentPageSearch, setCurrentPageSearch] = useState("");
  const [getPO, setGetPO] = useState("")

  // call get all po when load page
  useEffect(() => {
    if (search) {
      handleSearch(0);
    } else {
      getAllPo(0);
    }
  }, [selectedOption]);

  useEffect(() => {
    if(listPo !== null) {
      const sortedList = Array.from(listPo).sort((a, b) =>
        a.poNumber.localeCompare(b.poNumber)
      );
      setSortedListPo(sortedList);
    } else {
      setSortedListPo("")
    }
  }, [listPo]);

// handle close modal
  const handleClose = () => {
    setIsShowAddPO(false);
    setIsShowUpdate(false);
    setIsShowPODetail(false);
    setStatistical(false);
    setDataStatistical("")
    setDataPo("")
  };

  // call api get all po
  const getAllPo = async (page) => {
    let res = await getAllPO(page, selectedOption);
    if (res && res.data) {
      setListPo(res.data);
      setTotalProducts(res.totalPages);
    }
  };

  const itemsPerPage = selectedOption;
  const handlePageClick = async (event) => {
    const selectedPage = event.selected;
    const newStartIndex = selectedPage * itemsPerPage;
    setStartIndex(newStartIndex);
    if (search) {
      handleSearch(+event.selected);
      setCurrentPageSearch(selectedPage);
    } else {
      getAllPo(+event.selected);
      setCurrentPage(selectedPage);
    }
  };

  // handle update po
  const handleUpdatePO = (po) => {
    setDataPo(po);
    setIsShowUpdate(true);
  };

  // handle sort po
  const handleSort = (order, sortBy) => {
    setSortOrder(order);
    setSortBy(sortBy);
  };


  // handle show modal po
  const handleShowPo = (item) => {
    setIsShowPODetail(true);
    setDataPo(item);
  };

  // handle show modal statistical
  const handleViewPo = (item) => {
    setStatistical(true);
    setDataStatistical(item);
  };

  const handleSearch = async(page) => {
    if (search) {
      let res = await searchPO([search], "ALL", page, itemsPerPage);
      if(res && res.statusCode === 200) {
        setListPo(res.data)
        setTotalProducts(res.totalPages);
        setCurrentPageSearch(page);
      } else {
        if(res && res.statusCode === 204) {
          setListPo(res.data);
          setCurrentPageSearch(page);
        }
      }
    } else {
      getAllPo(0);
    }
  };

  const handleReset = () => {
    getAllPo(0)
    setSearch("")
    window.location.reload();
  }


  const handleGetPoNumber = (item) => {
    setGetPO(item)
    window.location.href = `/quanly?item=${JSON.stringify(item)}`;
  }

  const handlePressEnter = (event) => {
    if (event && event.key === "Enter") {
      handleSearch(0);
    }
  };

  return (
    <div className="po-tables">
      {user && user.auth && (
        <div className="my-3 add-new d-flex justify-content-between">
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
                  className="btn2 btn-primary2"
                  onClick={() => handleSearch()}
                >
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
            <div className="update-po col-2 mx-2">
              <button
                className="btn2 btn-primary2  "
                onClick={() => handleReset()}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="group-btn d-flex justify-content-between">
            {localStorage.getItem("role") === "ROLE_MANAGER" ||
            localStorage.getItem("role") === "ROLE_ADMIN" ? (
              <>
                <div className="update-po">
                  <button
                    className="btn btn-success"
                    onClick={() => setIsShowAddPO(true)}
                  >
                    <AiFillFileAdd />
                    Add New PO
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
      {localStorage.getItem("role") ? (
        <>
          <Table striped bordered hover className="shadow-sm bg-white rounded">
            <thead>
              <tr className="header-table">
                <th>Stt</th>
                <th>Số hợp đồng</th>
                <th>Số PO </th>
                <th>Số lượng</th>
                <th className="col-date">Ngày bắt đầu</th>
                <th className="col-date">Ngày kết thúc</th>
                <th className="col-date">Ngày hết hạn bảo lãnh THHĐ</th>
                <th className="col-date">Ngày hết hạn bảo lãnh bảo hành</th>
                <th>Ghi chú</th>
                {user && user.auth && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {sortedListPo &&
                sortedListPo.length > 0 &&
                sortedListPo.map((item, index) => {
                  const currentIndex = startIndex + index;
                  const timeBegin = item.beginAt;
                  let dataBegin;
                  const timeEnd = item.endAt;
                  let datEnd;
                  const time = item.contractWarrantyExpirationDate;
                  let dataTime;
                  if (time !== null) {
                    dataTime = moment(time).format("DD/MM/YYYY");
                  }
                  const timeWarranty = item.warrantyExpirationDate;
                  let dataWarranty;
                  if (timeWarranty !== null) {
                    dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
                  }
                  if (timeBegin !== null) {
                    dataBegin = moment(timeBegin).format("DD/MM/YYYY");
                  }

                  if (timeEnd !== null) {
                    datEnd = moment(timeEnd).format("DD/MM/YYYY");
                  }
                  return (
                    <tr
                      key={`po-${currentIndex}`}
                      onDoubleClick={() => handleShowPo(item)}
                    >
                      <td className="item-table ">{currentIndex + 1}</td>
                      <td className="item-table ">{item.contractNumber}</td>
                      <td
                        className="col-po"
                        onClick={() => handleGetPoNumber(item.poNumber)}
                      >
                        {item.poNumber}
                      </td>
                      <td className="item-table ">{item.quantity}</td>
                      <td className="item-table ">{dataBegin}</td>
                      <td className="item-table ">{datEnd}</td>
                      <td className="item-table ">{dataTime}</td>
                      <td className="item-table ">{dataWarranty}</td>
                      <td className="col-note">{item.note}</td>
                      <td className="col-action">
                        {localStorage.getItem("role") === "ROLE_MANAGER" ||
                        localStorage.getItem("role") === "ROLE_ADMIN" ? (
                          <>
                            <button
                              className="btn btn-warning btn-sm btn-respon"
                              onClick={() => handleUpdatePO(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-primary mx-2 btn-sm"
                              onClick={() => handleViewPo(item)}
                            >
                              View
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>

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
              <option value="150">150 / Trang</option>
            </Form.Select>
          </div>
        </>
      ) : (
        <>
          <div>
            <img src={logo} className="logo-ocean" />
            <div className="title">
              <h1 className="title-welcom">Chào mừng bạn đến với OCEAN QLSC</h1>
              <h4 className="title-sign">
                Vui lòng đăng nhập để xem chi tiết:{" "}
                <Link className="sign-account" to="/signin">
                  Đăng nhập ngay
                </Link>
              </h4>
            </div>
          </div>
        </>
      )}

      {/* Modal  */}
      <ModelAddPO
        show={isShowAddPO}
        handleClose={handleClose}
        getAllPo={getAllPo}
      />

      <ModalUpdatePo
        show={isShowUpdate}
        handleClose={handleClose}
        dataPo={dataPo}
        getAllPo={getAllPo}
        currentPage={currentPage}
        handleSearch={handleSearch}
        search={search}
        currentPageSearch={currentPageSearch}
      />

      <ModalShowPO
        show={isShowPODetail}
        handleClose={handleClose}
        dataPo={dataPo}
      />

      <ModalShowPOStatistical
        show={statistical}
        handleClose={handleClose}
        dataStatistical={dataStatistical}
      />
    </div>
  );
};

export default PO;
