import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginDrawer from "./LoginDrawer";
import Modal from "../UI/Modal";
import logo from "../../assets/logo .png";

import classes from "./Header.module.css";

const Header = () => {
  const [isDrawerShown, setIsDrawerShown] = useState(false);

  const toggleDrawerHandler = () => {
    setIsDrawerShown((prev) => !prev);
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link>
            <img src={logo} alt="logo" className={classes.logo} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul
              className={`navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center justify-content-end ${classes["navigation-list"]}`}
            >
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="#">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">
                  Register As A Professional
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">
                  My Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">
                  Help
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" onClick={toggleDrawerHandler}>
                  Login/Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isDrawerShown && (
        <LoginDrawer
          isDrawerShown={isDrawerShown}
          toggleDrawer={toggleDrawerHandler}
        />
      )}
    </div>
  );
};

export default Header;
