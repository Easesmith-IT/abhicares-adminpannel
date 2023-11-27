import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";

const Customers = () => {
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
        <div className={classes["report-container"]}>
          <div className={classes["report-header"]}>
            <h1 className={classes["recent-Articles"]}>Customers</h1>
            <button className={classes.view}>View All</button>
          </div>

          <div className={classes["report-body"]}>
            <div className={classes["report-topic-heading"]}>
              <h3 className={classes["t-op"]}>Customer Id</h3>
              <h3 className={classes["t-op"]}>Customer Name</h3>
              <h3 className={classes["t-op"]}>Contact Number</h3>
              <h3 className={classes["t-op"]}>Address</h3>
            </div>

            <div className={classes.items}>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Himashu</h3>
                <h3 className={classes["t-op-nextlvl"]}>8484930239</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  abc colony Lucknow U.P
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
