import React from "react";

import Categories from "../Header/Categories";
import Header from "../Header/Header";
import MiddleBody from "./MiddleBody";

const UpperBody = () => {
  return (
    <>
      <Header />
      <MiddleBody />
      <Categories />
    </>
  );
};

export default UpperBody;
