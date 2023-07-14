import React, { useEffect, useRef, useState } from "react";
import "./modalstatistical.scss";
import { Modal, Table } from "react-bootstrap";
import Chart from "chart.js";
import { showStatistical } from "../../../../service/service";
// import { Bar } from "react-chartjs-2";

const ModalShowPOStatistical = (props) => {
  const { show, handleClose, dataStatistical } = props;
  const [listPo, setListPo] = useState("");
  const chartRef = useRef(null);
  const chartRefXK = useRef(null);
  const chartRefKCS = useRef(null);
  const chartRefBH = useRef(null);
  let myChartSC = null;
  let myChartXK = null;
  let myChartKCS = null;
  let myChartBH = null;

  // check show
  useEffect(() => {
    if (show) {
      handleShow();
    }
  }, [dataStatistical]);

  // check if there is a listpo then turn on the chart
  useEffect(() => {
    if (listPo) {
      createOrUpdateChartSC();
      createOrUpdateChartXK();
      createOrUpdateChartKCS();
      createOrUpdateChartBH();
    }
  }, [listPo]);

  // chart repair status
  const createOrUpdateChartSC = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (myChartSC) {
        myChartSC.destroy();
      }

      myChartSC = new Chart(ctx, {
        type: "horizontalBar", // Thay đổi kiểu biểu đồ thành "horizontalBar"
        data: {
          labels: ["Chưa cập nhật", "Cháy nổ", "SC không được", "SC xong"],
          datasets: [
            {
              data: [
                listPo.TRANG_THAI_SC.CHUA_CAP_NHAT,
                listPo.TRANG_THAI_SC.SC_KHONG_DUOC,
                listPo.TRANG_THAI_SC.CHAY_NO,
                listPo.TRANG_THAI_SC.SC_XONG,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 1)", // Đỏ đậm
                "rgba(100, 255, 0, 1)", // Xanh lá cây đậm
                "rgba(200, 50, 255, 1)", // Tím đậm
                "rgba(0, 100, 255, 1)", // Xanh dương đậm
              ],
              borderWidth: 0, // Loại bỏ đường viền của các thanh
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ ticks: { beginAtZero: true } }], // Thêm xAxes với thuộc tính ticks để bắt đầu từ giá trị 0
            yAxes: [{ barThickness: 30 }], // Thêm yAxes với thuộc tính barThickness để chỉ định độ dày của thanh
          },
          legend: {
            display: false, // Ẩn hình chú thích
          },
        },
      });
    }
  };


  const createOrUpdateChartXK = () => {
    if (chartRefXK.current) {
      const ctx = chartRefXK.current.getContext("2d");

      if (myChartXK) {
        myChartXK.destroy();
      }

      myChartXK = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: ["Chưa cập nhật", "Đã cập nhật"],
          datasets: [
            {
              data: [
                listPo.XUAT_KHO.CHUA_CAP_NHAT,
                listPo.XUAT_KHO.DA_CAP_NHAT,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 1)", // Đỏ đậm
                "rgba(100, 255, 0, 1)", // Xanh lá cây đậm
                "rgba(200, 50, 255, 1)", // Tím đậm
                "rgba(0, 100, 255, 1)", // Xanh dương đậm
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ ticks: { beginAtZero: true } }], // Thêm xAxes với thuộc tính ticks để bắt đầu từ giá trị 0
            yAxes: [{ barThickness: 30 }], // Thêm yAxes với thuộc tính barThickness để chỉ định độ dày của thanh
          },
          legend: {
            display: false, // Ẩn hình chú thích
          },
        },
      });
    }
  };

  // chart kcs
  const createOrUpdateChartKCS = () => {
    if (chartRefKCS.current) {
      const ctx = chartRefKCS.current.getContext("2d");

      if (myChartKCS) {
        myChartKCS.destroy();
      }

      myChartKCS = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: ["Chưa cập nhật", "FAIL", "PASS"],
          datasets: [
            {
              data: [
                listPo.KSC_VT.CHUA_CAP_NHAT,
                listPo.KSC_VT.FAIL,
                listPo.KSC_VT.PASS,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 1)", // Đỏ đậm
                "rgba(100, 255, 0, 1)", // Xanh lá cây đậm
                "rgba(200, 50, 255, 1)", // Tím đậm
                "rgba(0, 100, 255, 1)", // Xanh dương đậm
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ ticks: { beginAtZero: true } }], // Thêm xAxes với thuộc tính ticks để bắt đầu từ giá trị 0
            yAxes: [{ barThickness: 30 }], // Thêm yAxes với thuộc tính barThickness để chỉ định độ dày của thanh
          },
          legend: {
            display: false, // Ẩn hình chú thích
          },
        },
      });
    }
  };

  // chart warranty
  const createOrUpdateChartBH = () => {
    if (chartRefBH.current) {
      const ctx = chartRefBH.current.getContext("2d");

      if (myChartBH) {
        myChartBH.destroy();
      }

      myChartBH = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: ["Chưa cập nhật", "Đã cập nhật"],
          datasets: [
            {
              data: [
                listPo.BAO_HANH.CHUA_CAP_NHAT,
                listPo.BAO_HANH.DA_CAP_NHAT,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 1)", // Đỏ đậm
                "rgba(100, 255, 0, 1)", // Xanh lá cây đậm
                "rgba(200, 50, 255, 1)", // Tím đậm
                "rgba(0, 100, 255, 1)", // Xanh dương đậm
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ ticks: { beginAtZero: true } }], // Thêm xAxes với thuộc tính ticks để bắt đầu từ giá trị 0
            yAxes: [{ barThickness: 30 }], // Thêm yAxes với thuộc tính barThickness để chỉ định độ dày của thanh
          },
          legend: {
            display: false, // Ẩn hình chú thích
          },
        },
      });
    }
  };

  // handle show po and get po number
  const handleShow = async () => {
    let res = await showStatistical(dataStatistical.poNumber);
    if (res && res.statusCode === 200) {
      setListPo(res.data);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thống kê {dataStatistical.poNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chart-statistical">
            <div className="card">
              <div
                className="card-body"
                style={{ height: "250px", width: "350px" }}
              >
                <canvas ref={chartRef} />
                <p className="chart-name">
                  <b>Tổng hợp Trạng thái SC</b>
                </p>
              </div>
            </div>
            <div className="card">
              <div
                className="card-body"
                style={{ height: "250px", width: "350px" }}
              >
                <canvas ref={chartRefXK} />
                <p className="chart-name">
                  <b>Tổng hợp Xuất kho</b>
                </p>
              </div>
            </div>

            <div className="card">
              <div
                className="card-body"
                style={{ height: "250px", width: "350px" }}
              >
                <canvas ref={chartRefKCS} />
                <p className="chart-name">
                  <b>Tổng hợp KCS</b>
                </p>
              </div>
            </div>

            <div className="card">
              <div
                className="card-body"
                style={{ height: "250px", width: "350px" }}
              >
                <canvas ref={chartRefBH} />
                <p className="chart-name">
                  <b>Tổng hợp Bảo hành</b>
                </p>
              </div>
            </div>
          </div>
          <div className="total-po">
            {listPo && Object.keys(listPo).length > 0 && (
              <>
                <div className="total border-0">
                  <h4>SL khai báo theo PO</h4>
                  <h1>{listPo.TONG_SO_LUONG.TONG}</h1>
                </div>
                <div className="total-import">
                  <h4>Số lượng import</h4>
                  <h1>{listPo.TONG_SO_LUONG.SO_LUONG_IMPORT}</h1>
                </div>
              </>
            )}
          </div>
          {/* table and chart repair status */}
          <div className="table-status">
            <div className="table-sc">
              <div className="statistical-sc">
                <Table
                  striped
                  bordered
                  hover
                  size="lg"
                  className="table-statistical"
                >
                  <thead>
                    <tr className="text-md-center">
                      <th colSpan={4}>Trạng thái sửa chữa</th>
                      <th colSpan={2}>Xuất kho</th>
                      <th colSpan={3}>KCS</th>
                      <th colSpan={2}>Bảo hành</th>
                    </tr>
                    <tr className="text-md-center">
                      <th className="col-content">Sửa chữa xong</th>
                      <th className="col-content">SC không được</th>
                      <th className="col-content">Cháy nổ</th>
                      <th className="col-content">Chưa cập nhật</th>
                      <th className="col-content">Đã cập nhật</th>
                      <th className="col-content">Chưa cập nhật</th>
                      <th className="col-content">Pass</th>
                      <th className="col-content">Fail</th>
                      <th className="col-content">Chưa cập nhật</th>
                      <th className="col-content">Đã cập nhật</th>
                      <th className="col-content">Chưa cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPo && Object.keys(listPo).length > 0 && (
                      <>
                        <tr className="text-md-center">
                          <td>{listPo.TRANG_THAI_SC.SC_XONG}</td>
                          <td>{listPo.TRANG_THAI_SC.SC_KHONG_DUOC}</td>
                          <td>{listPo.TRANG_THAI_SC.CHAY_NO}</td>
                          <td>{listPo.TRANG_THAI_SC.CHUA_CAP_NHAT}</td>
                          <td>{listPo.XUAT_KHO.DA_CAP_NHAT}</td>
                          <td>{listPo.XUAT_KHO.CHUA_CAP_NHAT}</td>
                          <td>{listPo.KSC_VT.PASS}</td>
                          <td>{listPo.KSC_VT.FAIL}</td>
                          <td>{listPo.KSC_VT.CHUA_CAP_NHAT}</td>
                          <td>{listPo.BAO_HANH.DA_CAP_NHAT}</td>
                          <td>{listPo.BAO_HANH.CHUA_CAP_NHAT}</td>
                        </tr>
                        <tr>
                          <td>Tỉ lệ hoàn thành: </td>
                          <td colSpan={10}>
                            {listPo.KSC_VT.PASS
                              ? (
                                  (listPo.KSC_VT.PASS /
                                    (listPo.TONG_SO_LUONG.SO_LUONG_IMPORT -
                                      listPo.TRANG_THAI_SC.CHAY_NO)) *
                                  100
                                ).toFixed(2)
                              : 0}
                            %
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalShowPOStatistical;
