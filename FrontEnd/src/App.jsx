import { React,  useEffect } from "react";
import "./App.scss";
import { Header } from "./Components/Header/Header";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleRefresh } from "./redux/actions/userAction";

function App() {

  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem("email")) {
      dispatch(handleRefresh())
    }
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <Header />
      </div>

      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
