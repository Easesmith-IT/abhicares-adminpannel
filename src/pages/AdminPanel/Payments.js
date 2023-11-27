import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";
const Payments = () => {
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
            <h1 className={classes["recent-Articles"]}>Payments</h1>
            <button className={classes.view}>View All</button>
          </div>

          <div className={classes["report-body"]}>
            <div className={classes["report-topic-heading"]}>
              <h3 className={classes["t-op"]}>Customer Id</h3>
              <h3 className={classes["t-op"]}>Service</h3>
              <h3 className={classes["t-op"]}>Location</h3>
              <h3 className={classes["t-op"]}>Transaction Id</h3>
              <h3 className={classes["t-op"]}>Amount</h3>
            </div>

            <div className={classes.items}>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
                <h3 className={classes["t-op-nextlvl"]}>Carpeter</h3>
                <h3 className={classes["t-op-nextlvl"]}>Lucknow UP</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  34443424234242424
                </h3>
                <h3 className={classes["t-op-nextlvl"]}>2000</h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>rohan900</h3>
                <h3 className={classes["t-op-nextlvl"]}>Carpeter</h3>
                <h3 className={classes["t-op-nextlvl"]}>Lucknow UP</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  34443424234242424
                </h3>
                <h3 className={classes["t-op-nextlvl"]}>4000</h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>rohan900</h3>
                <h3 className={classes["t-op-nextlvl"]}>Carpeter</h3>
                <h3 className={classes["t-op-nextlvl"]}>Lucknow UP</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  34443424234242424
                </h3>
                <h3 className={classes["t-op-nextlvl"]}>4000</h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>rohan900</h3>
                <h3 className={classes["t-op-nextlvl"]}>Carpeter</h3>
                <h3 className={classes["t-op-nextlvl"]}>Lucknow UP</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  34443424234242424
                </h3>
                <h3 className={classes["t-op-nextlvl"]}>4000</h3>
              </div>
              <div className={classes.item1}>
                <h3 className={classes["t-op-nextlvl"]}>rohan900</h3>
                <h3 className={classes["t-op-nextlvl"]}>Carpeter</h3>
                <h3 className={classes["t-op-nextlvl"]}>Lucknow UP</h3>
                <h3 className={`${classes["t-op-nextlvl"]}`}>
                  34443424234242424
                </h3>
                <h3 className={classes["t-op-nextlvl"]}>4000</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
