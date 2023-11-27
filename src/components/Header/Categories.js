import React, { useState } from "react";
import CategoryDrawer from "../../pages/CategoryDrawer";
import HomeServiceImg from "../../assets/mainCategories/HomeService.jpg";
import AppRepairImg from "../../assets/mainCategories/Appliance Repair.jpeg";
import PerCareImg from "../../assets/mainCategories/PersonalCare.jpeg";

import classes from "./Categories.module.css";
const Categories = (props) => {
  const [showDrawerState, setShowDrawerState] = useState({
    showDrawer: false,
    id: "",
  });

  const toggleDrawerOpenHandler = (id) => {
    console.log("clicked");
    setShowDrawerState((prev) => ({
      showDrawer: !prev.showDrawer,
      id: id,
    }));
  };
  const DUMMY_CATEGORIES = [
    {
      id: "c1",
      key: "1",
      title: "Home Repair",
      img: HomeServiceImg,
      rating: "4.84 (9.5 M bookings)",
    },
    {
      id: "c2",
      key: "2",
      title: "Appliance Repair",
      img: AppRepairImg,
      rating: "4.84 (9.5 M bookings)",
    },
    {
      id: "c3",
      key: "3",
      img: PerCareImg,
      title: "Personal Care",
      rating: "4.84 (9.5 M bookings)",
    },
  ];

  return (
    <React.Fragment>
      <div className={classes["wrapping-container"]}>
        <h2 className={`${classes.center} ${classes.section_heading}`}>
          Our Main Categories
        </h2>
        <div
          className={`card-group justify-content-evenly ${classes["main-categories"]}`}
        >
          {DUMMY_CATEGORIES.map((cat) => (
            <div className={classes.categoryElement}>
              <div
                className={`card ${classes.categoryCard}`}
                key={cat.id}
                onClick={() => toggleDrawerOpenHandler(cat.id)}
              >
                <img
                  src={cat.img}
                  className={`card-img-top ${classes.categoryImage}`}
                  alt="..."
                />
              </div>
              <p className={`card-title ${classes.center}`}>{cat.title}</p>
            </div>
          ))}
        </div>
      </div>
      {showDrawerState.showDrawer && (
        <CategoryDrawer
          onClick={toggleDrawerOpenHandler}
          chosenCategoryId={showDrawerState.id}
        />
      )}
    </React.Fragment>
  );
};

export default Categories;
