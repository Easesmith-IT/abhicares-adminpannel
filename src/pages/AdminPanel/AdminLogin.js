import React, { useRef } from "react";
import logo from "../../assets/logo .png";
import { useNavigate, Link } from "react-router-dom";

import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../global-variables";

const AdminLogin = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  const handleAdminLogin = () => {
    const userName = userNameRef.current.value;
    const userPassword = userPasswordRef.current.value;

    if (userName === ADMIN_USERNAME && userPassword === ADMIN_PASSWORD) {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid username or password");
    }

    console.log(userName, userPassword);
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          padding: "45px",
          width: "50%",
          // border: "2px solid",
          margin: "0 auto",
        }}
        className="shadow-lg p-3 mb-5 bg-body-tertiary rounded"
      >
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/">
            <img src={logo} alt="logo" width={200} />
          </Link>
        </div>
        <h3 className="d-flex justify-content-center align-items-center my-4">
          Admin Login
        </h3>
        <div className="mb-3">
          <label for="email" className="form-label">
            User name
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            ref={userNameRef}
          />
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            ref={userPasswordRef}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleAdminLogin}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
