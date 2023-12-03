import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./components/Header";
import SideNav from "./components/SideNav";
import Loader from "../../components/loader/Loader";

import classes from "./Shared.module.css";
import axios from "axios";

const Services = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const navigate = useNavigate();

  const toggleMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };
  const token = localStorage.getItem("adUx")
  const headers = {
      Authorization:token
  }

  const getAllCategories = async () => {
    try {
      console.log('url',process.env.REACT_APP_API_URL)
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-category`,{headers})
      setAllCategories(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, [])


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
            {allCategories.length === 0 && <Loader />}
            {allCategories?.map((category) => (
              <div key={category._id} onClick={() => navigate(`/admin/services/${category._id}`, { state: { categoryName: category.name } })} className={classes.card}>
                <div>
                  <h5>{category.name}</h5>
                  <p>Total Services : {category.totalServices}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
