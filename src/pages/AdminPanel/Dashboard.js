import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Main from "./components/Main";
import { useNavigate } from "react-router-dom";



import classes from "./Shared.module.css";

const AdminPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate()

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };
  const token = localStorage.getItem("adUx")
  if(!token){
    navigate('/');
    return;
  }
  return (
    <div>
      <Header onClick={toggleMenuHandler} />

      <div className={classes["main-container"]}>
        <div
          className={`${classes.navcontainer} ${
            showMenu ? classes.navclose : ""
          }`}
        >
          <SideNav />
        </div>
        <Main />
      </div>
    </div>
  );
};

export default AdminPage;
