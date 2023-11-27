import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";

const Offers = () => {
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
        <h1>Offers</h1>
      </div>
    </div>
  );
};

export default Offers;
