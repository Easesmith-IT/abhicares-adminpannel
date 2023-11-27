import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.servicesContainer}>
        <ul>
          <li>
            <Link>Home</Link>
          </li>
          <li>
            <Link>Register as a Professional</Link>
          </li>
          <li>
            <Link>My Bookings</Link>
          </li>
          <li>
            <Link>Help</Link>
          </li>
          <li>
            <Link>Login/SignUp</Link>
          </li>

          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </div>
      <div className={styles.pagesContainer}>
        <ul>
          <li>
            <Link>About Us</Link>
          </li>
          <li>
            <Link>Contact Us</Link>
          </li>
          <li>
            <Link>Services</Link>
          </li>
          <li>
            <Link>Complaint</Link>
          </li>
          <li>
            <Link>Feedback</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
