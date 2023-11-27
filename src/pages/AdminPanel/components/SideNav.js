import React from "react";
import { Link } from "react-router-dom";

import ServiceIcn from "../../../assets/admin-panel/services-icon.png";
import PaymentsIcn from "../../../assets/admin-panel/bank-icon.png";
import DashboardIcn from "../../../assets/admin-panel/dashboard-icon.png";
import PartnersIcn from "../../../assets/admin-panel/partners-icon.png";
import CustomersIcn from "../../../assets/admin-panel/customer-icon.png";
import OffersIcn from "../../../assets/admin-panel/offer-icon.png";

import classes from "../Shared.module.css";

const SideNav = () => {
  return (
    <nav className={classes.nav}>
      <div className={classes["nav-upper-options"]}>
        <Link
          to="/admin/dashboard"
          className={`${classes["nav-option"]} ${classes.option1}}`}
        >
          <img
            src={DashboardIcn}
            alt="dashboard"
            className={classes["nav-img"]}
          />
          <h3 className={classes.title}>Dashboard</h3>
        </Link>

        <Link
          to="/admin/services"
          className={`${classes["nav-option"]} ${classes.option2}}`}
        >
          <img src={ServiceIcn} className={classes["nav-img"]} alt="services" />

          <h3 className={classes.title}>Services</h3>
        </Link>

        <Link
          to="/admin/partners"
          className={`${classes["nav-option"]} ${classes.option3}}`}
        >
          <img
            src={PartnersIcn}
            alt="Partners"
            className={classes["nav-img"]}
          />
          <h3 className={classes.title}>Partners</h3>
        </Link>

        <Link
          to="/admin/customers"
          className={`${classes["nav-option"]} ${classes.option4}}`}
        >
          <img
            src={CustomersIcn}
            alt="customers"
            className={classes["nav-img"]}
          />
          <h3 className={classes.title}>Customers</h3>
        </Link>

        <Link
          to="/admin/offers"
          className={`${classes["nav-option"]} ${classes.option5}}`}
        >
          <img src={OffersIcn} alt="offers" className={classes["nav-img"]} />
          <h3 className={classes.title}>Offers</h3>
        </Link>

        <Link
          to="/admin/payments"
          className={`${classes["nav-option"]} ${classes.option6}}`}
        >
          <img
            src={PaymentsIcn}
            alt="payments"
            className={classes["nav-img"]}
          />

          <h3 className={classes.title}>Payments</h3>
        </Link>
      </div>
    </nav>
  );
};

export default SideNav;
