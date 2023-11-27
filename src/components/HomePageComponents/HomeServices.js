import React from "react";
import { Link } from "react-router-dom";
import AppRepairImg from "../../assets/mainCategories/Appliance Repair.jpeg";
import HomePaintingImg from "../../assets/mainCategories/HomePainting.jpg";
import CleaningPestImg from "../../assets/mainCategories/Cleaning.jpg";
import DisinfectionImg from "../../assets/mainCategories/disinfectant.jpg";
import HomeRepairImg from "../../assets/mainCategories/HomeService.jpg";
import classes from "./HomeServices.module.css";

const HomeServices = () => {
  const HOME_SERVICES1 = [
    {
      title: "Appliance Repair",
      key: "hs1",
      img: AppRepairImg,
    },
    {
      title: "Home Painting",
      key: "hs2",
      img: HomePaintingImg,
    },
    {
      title: "Cleaning & Pest",
      key: "hs3",
      img: CleaningPestImg,
    },
  ];

  const HOME_SERVICES2 = [
    {
      title: "Disinfection",
      key: "hs4",
      img: DisinfectionImg,
    },
    {
      title: "Home Repairs",
      key: "hs5",
      img: HomeRepairImg,
    },
  ];
  return (
    <div className={classes.homeServices_wrapper}>
      <h2 className={`${classes.center} ${classes.section_heading}`}>
        Home Services
      </h2>
      <div className={classes["home-services-container"]}>
        <div className={classes["home-services1"]}>
          {HOME_SERVICES1.map((service) => (
            // <Link key={service.key} className={classes.link}>
            <Link className={classes.link}>
              <img
                src={service.img}
                alt={service.title}
                className={classes.serviceImg}
              />
              <p className={classes.center}>{service.title}</p>
            </Link>
          ))}
        </div>
        <div className={classes["home-services2"]}>
          {HOME_SERVICES2.map((service) => (
            <Link className={classes.link}>
              <img
                src={service.img}
                alt={service.title}
                className={classes.serviceImg}
              />
              <p className={classes.center}>{service.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeServices;
