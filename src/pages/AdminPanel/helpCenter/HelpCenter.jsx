import React from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../Wrapper";
import classes from "./HelpCenter.module.css";



const HelpCenter = () => {
  return (
    <Wrapper>
      <div className={classes.container_wrapper}>
        <Link to="/admin/help-center/tickets" className={classes.tickets}>
          Tickets/Issues
        </Link>
        <Link to="/admin/help-center/faqs" className={classes.faqs}>
          Faqs
        </Link>
      </div>
    </Wrapper>
  );
};

export default HelpCenter;
