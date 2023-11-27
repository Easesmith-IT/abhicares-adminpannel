import React, { useState } from "react";
import logo from "../assets/logo .png";

import classes from "./Login.module.css";

const Login = () => {
  const [isUserNameFocused, setIsUserNameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const inputFocusHandler = (inputType) => {
    if (inputType === "username") {
      setIsUserNameFocused((prev) => !prev);
    }
    if (inputType === "password") {
      setIsPasswordFocused((prev) => !prev);
    }
  };

  return (
    <div className={classes.login}>
      <div className={`${classes.logo} ${classes["text-center"]}`}>
        <img src={logo} alt="logo" />
      </div>
      <div className={classes.wrapper}>
        <div
          className={`${classes["inner-warpper"]} ${classes["text-center"]}`}
        >
          <h2 className={classes.title}>Login to your account</h2>
          <form id="formvalidate">
            <div
              className={`${classes["input-group"]} ${
                isUserNameFocused && classes.focused
              }`}
            >
              <label className={classes.palceholder} htmlFor="userName">
                User Name
              </label>
              <input
                className={classes["form-control"]}
                name="userName"
                id="userName"
                type="text"
                placeholder=""
                onClick={() => inputFocusHandler("username")}
              />
              <span className="lighting"></span>
            </div>
            <div
              className={`${classes["input-group"]} ${
                isPasswordFocused && classes.focused
              }`}
            >
              <label className={classes.palceholder} htmlFor="userPassword">
                Password
              </label>
              <input
                className={classes["form-control"]}
                name="userPassword"
                id="userPassword"
                type="password"
                placeholder=""
                onClick={() => inputFocusHandler("password")}
              />
              <span className={classes.lighting}></span>
            </div>

            <button type="submit" id="login" className={classes.button}>
              Login
            </button>
            <div className={`${classes.clearfix} ${classes.supporter}`}>
              <div
                className={`${classes["pull-left"]} ${classes["remember-me"]}`}
              >
                <input id="rememberMe" type="checkbox" />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <a
                className={`${classes["pull-right"]} ${classes.forgot}`}
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
