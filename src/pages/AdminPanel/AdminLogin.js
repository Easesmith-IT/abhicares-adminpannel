import React, { useRef } from "react";
import axios from 'axios';
import logo from "../../assets/logo .png";
import { useNavigate, Link } from "react-router-dom";


const AdminLogin = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const userPasswordRef = useRef();

  const handleAdminLogin = async(e) => {
    e.preventDefault()
    console.log('inside ')
    const userName = userNameRef.current.value;
    const userPassword = userPasswordRef.current.value;

    const response = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/login-Admin`,{
        adminId:userName,
        password:userPassword
      })

      if(response.status===500){
        alert('Something went wrong!')
        return;
      }

        if(response.data.token){
          const token = response.data.token;
          localStorage.setItem('adUx',token);
          alert('Logged in successfully');
          navigate('/admin/dashboard')
        }
        else{
          alert('Incorrect credentials');
          return;
        }
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
      onSubmit={(e)=>handleAdminLogin(e)}
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
          <label for="username" className="form-label">
            Admin Id
          </label>
          <input
            type="text"
            className="form-control"
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
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
