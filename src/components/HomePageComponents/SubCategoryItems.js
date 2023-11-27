import React from "react";
import { Link } from "react-router-dom";

import styles from "./SubCategoryItems.module.css";
const CategoryItem = (props) => {
  return (
    <ul style={{ display: "flex", flexDirection: "column" }}>
      {props.category.subCategories.map((el) => (
        <Link
          to={`/${props.category.id}/categories`}
          className={styles.link}
          key={el}
        >
          {el}
        </Link>
      ))}
    </ul>
  );
};

export default CategoryItem;
