import React, { useState } from "react";
import AddBtn from "../../assets/add-icon-nobg.png";

import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";

const Services = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };
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
        <div className={classes["services-wrapper"]}>
          <div className={classes["services-header"]}>
            <h2>Services</h2>
            <button className={classes.services_add_btn}>
              <img src={AddBtn} alt="add service" />
            </button>
          </div>
          <div className={classes.servicesBox1}>
            <div className={classes.center}>Service-1</div>
            <div className={classes.center}>Service-2</div>
            <div className={classes.center}>Service-3</div>
          </div>

          <div className={classes.servicesBox2}>
            <div className={classes.center}>Service-4</div>
            <div className={classes.center}>Service-5</div>
            <div className={classes.center}>Service-6</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
