import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import SideNav from "./components/SideNav";

import classes from "./Shared.module.css";

const Partners = () => {
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

        <div className={classes.partners}>
          <Link>
            <div>Partner -1</div>
          </Link>
          <Link>
            <div>Partner -2</div>
          </Link>
          <Link>
            <div>Partner -3</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Partners;
