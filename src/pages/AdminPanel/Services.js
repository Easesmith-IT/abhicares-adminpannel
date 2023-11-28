import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";

const Services = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };
  return (
    <div>
      <Header onClick={toggleMenuHandler} />

      <div className={classes["main-container"]}>
        <div
          className={`${classes.navcontainer} ${showMenu ? classes.navclose : ""
            }`}
        >
          <SideNav />
        </div>
        <div className={classes["services-wrapper"]}>
          <div className={classes["services-header"]}>
            <h2>Categories</h2>
            {/* <button className={classes.services_add_btn}>
              <img src={AddBtn} alt="add service" />
            </button> */}
          </div>
          <div className={classes.card_container}>
            <div onClick={() => navigate("/admin/services/123")} className={classes.card}>
              <div>
                <h5>Category name</h5>
                <p>Total Services : 3</p>
              </div>
            </div>
            <div onClick={() => navigate("/admin/services/123")} className={classes.card}>
              <div>
                <h5>Category name</h5>
                <p>Total Services : 3</p>
              </div>
            </div>
            <div onClick={() => navigate("/admin/services/123")} className={classes.card}>
              <div>
                <h5>Category name</h5>
                <p>Total Services : 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
