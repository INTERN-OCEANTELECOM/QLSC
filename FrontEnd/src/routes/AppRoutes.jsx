import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import PO from "../Components/PO/PO.jsx";
import { TableHH } from "../Components/TableHH/TableHH.jsx";
import Signin from "../Components/Signin/Signin.jsx";
import Admin from "../Components/Admin/Admin.jsx";
import Diary from "../Components/Diary/Diary.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import ResetPassword from "../Components/ResetPassword/ResetPassword.jsx";
import { CheckEmail } from "../Components/CheckEmail/CheckEmail.jsx";
import { ForgotPassword } from "../Components/ForgotPassword/ForgotPassword.jsx";
import Product from "../Components/Product/Product.jsx";
import NotFound from "./NotFound.jsx";
import BarCodeCheck from "../Components/BarCodeCheck/BarCodeCheck.jsx";
import SNCheck from "../Components/SN Check/SNCheck.jsx";
import QLSC from "../Components/QLSC/QLSC.jsx";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="quanly"
            element={
              <PrivateRoutes>
                <TableHH />
              </PrivateRoutes>
            }
          />
          <Route index element={<PO />} />
          <Route
            path="sanpham"
            element={
              <PrivateRoutes>
                <Product />
              </PrivateRoutes>
            }
          />
          {/* <Route path="barcode-check" element={<BarCodeCheck />} />
          <Route path="sn-check" element={<SNCheck />} /> */}
          <Route path="quan-li-sua-chua" element={<QLSC />} />
        </Route>
        <Route path="signin" element={<Signin />} />
        <Route path="admin" element={<Admin />} />
        <Route path="history" element={<Diary />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
