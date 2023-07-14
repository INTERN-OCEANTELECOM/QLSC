import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context/UseContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      {/* <UserProvider> */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      {/* </UserProvider> */}
    </React.StrictMode>
  </Provider>
);
