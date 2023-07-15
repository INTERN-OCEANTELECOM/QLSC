import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import PO from "../Components/PO/PO.jsx";
import { TableHH } from "../Components/TableHH/TableHH.jsx";
import Signin from "../Components/Signin/Signin.jsx";
import Admin from "../Components/Admin/Admin.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import ResetPassword from "../Components/ResetPassword/ResetPassword.jsx";
import { CheckEmail } from "../Components/CheckEmail/CheckEmail.jsx";
import { ForgotPassword } from "../Components/ForgotPassword/ForgotPassword.jsx";
import Product from "../Components/Product/Product.jsx";
import SNCheck from "../Components/SN Check/SNCheck.jsx";

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
          <Route
            path="sn-check"
            element={
              <PrivateRoutes>
                <SNCheck />
              </PrivateRoutes>
            }
          />
        </Route>
        <Route path="signin" element={<Signin />} />
        <Route path="admin" element={<Admin />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
