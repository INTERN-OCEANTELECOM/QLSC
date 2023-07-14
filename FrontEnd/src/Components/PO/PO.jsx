import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./po.scss";
import { AiFillFileAdd, AiOutlineSortAscending } from "react-icons/ai";
import ModelAddPO from "../Modal/PO/ModalAddPO/ModelAddPO";
import ModalUpdatePo from "../Modal/PO/ModalUpdate/ModalUpdatePo";
import { getPo } from "../../service/service";
import moment from "moment";
import { Link } from "react-router-dom";
import ModalShowPO from "../Modal/PO/ModalShow/ModalShowPO";
import ModalShowPOStatistical from "../Modal/PO/ModalShow/ModalShowPOStatistical";
import logo from "../../assets/logo_28-06-2017_LogoOceanTelecomtailieupng-removebg-preview.png";
import { useSelector } from "react-redux";

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

  // call get all po when load page
  useEffect(() => {
    getAllPo();
  }, []);

// handle close modal
  const handleClose = () => {
    setIsShowAddPO(false);
    setIsShowUpdate(false);
    setIsShowPODetail(false);
    setStatistical(false);
    setDataStatistical("")
  };

  // call api get all po
  const getAllPo = async () => {
    let res = await getPo();
    if (res && res.data) {
      setListPo(res.data);
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

  useEffect(() => {
    if (!Array.isArray(listPo)) {
      return;
    }
    const sortedList = [...listPo];

    sortedList.sort((a, b) => {
      const aNumber = parseInt(a.poNumber.substring(2));
      const bNumber = parseInt(b.poNumber.substring(2));

      if (sortOrder === "asc") {
        return aNumber - bNumber;
      } else {
        return bNumber - aNumber;
      }
    });

    setSortedListPo(sortedList);
  }, [listPo, sortOrder, sortBy]);

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

  return (
    <div className="po-tables">
      {user && user.auth && (
        <div className="my-3 add-new d-flex justify-content-between">
          <div className="col-3"></div>
          <div className="group-btn d-flex">
            {localStorage.getItem("role") === "ROLE_MANAGER" ||
            localStorage.getItem("role") === "ROLE_ADMIN" ? (
              <div className="update-po">
                <button
                  className="btn btn-success"
                  onClick={() => setIsShowAddPO(true)}
                >
                  <AiFillFileAdd />
                  Add New PO
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {localStorage.getItem("role") ? (
        <Table striped bordered hover className="shadow-sm bg-white rounded">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Số hợp đồng</th>
              <th>Số PO </th>
              <th>Số lượng</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Ngày hết hạn bảo lãnh THHĐ</th>
              <th>Ngày hết hạn bảo lãnh bảo hành</th>
              {user && user.auth && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {sortedListPo &&
              sortedListPo.length > 0 &&
              sortedListPo.map((item, index) => {
                const timeBegin = item.beginAt;
                const dataBegin = moment(timeBegin).format("DD/MM/YYYY");
                const timeEnd = item.endAt;
                const datEnd = moment(timeEnd).format("DD/MM/YYYY");
                const time = item.contractWarrantyExpirationDate;
                const dataTime = moment(time).format("DD/MM/YYYY");
                const timeWarranty = item.warrantyExpirationDate;
                const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
                return (
                  <tr
                    key={`po-${index}`}
                    onDoubleClick={() => handleShowPo(item)}
                  >
                    <td>{index + 1}</td>
                    <td>{item.contractNumber}</td>
                    <td>{item.poNumber}</td>
                    <td>{item.quantity}</td>
                    <td>{dataBegin}</td>
                    <td>{datEnd}</td>
                    <td>{dataTime}</td>
                    <td>{dataWarranty}</td>
                    <td>
                      {localStorage.getItem("role") === "ROLE_MANAGER" ||
                      localStorage.getItem("role") === "ROLE_ADMIN" ? (
                        <>
                          <button
                            className="btn btn-warning btn-xl"
                            onClick={() => handleUpdatePO(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-primary mx-3 btn-xl"
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
