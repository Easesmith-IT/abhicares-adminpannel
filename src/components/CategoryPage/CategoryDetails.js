import React from "react";
import { useParams } from "react-router-dom";

import styles from "./CategoryDetails.module.css";
const CategoryDetails = () => {
  const cId = useParams().categoryId;
  const sId = useParams().serviceId;

  return (
    <div>
      <h1 className={styles.center}>
        Haircut + Beard grooming + Relaxing head massage
      </h1>
      <p className={styles.serviceTimeText}>Service time: 1h 5mins</p>
      <div className={styles.radioContainer}>
        <h3 className={styles.center}>Haircut</h3>

        <label>
          <input type="radio" name="options" value="option1" />
          <span className={styles.radioSpanText}>Haircut for men</span>
          <span className={styles.radioOptionPrice}>&#x20b9;149</span>
        </label>
        <label>
          <input type="radio" name="options" value="option2" />
          <span className={styles.radioSpanText}>I don't need a haircut</span>
        </label>
      </div>
      <div className={styles.radioContainer}>
        <h3 className={styles.center}>Beard Grooming</h3>
        <label>
          <input type="radio" name="options" value="option1" />
          <span className={styles.radioSpanText}>Bread Grooming</span>
          <span className={styles.radioOptionPrice}>&#x20b9;229</span>
        </label>
        <label>
          <input type="radio" name="options" value="option2" />
          <span className={styles.radioSpanText}>
            I don't need a bread grooming
          </span>
        </label>
      </div>
      <div className={styles.radioContainer}>
        <h3 className={styles.center}>Massage</h3>
        <label>
          <input type="radio" name="options" value="option1" />

          <span className={styles.radioSpanText}>10 min relaxing massage</span>
          <span className={styles.radioOptionPrice}>&#x20b9;249</span>
        </label>
        <label>
          <input type="radio" name="options" value="option2" />
          <span className={styles.radioSpanText}>20 min relaxing massage</span>
          <span className={styles.radioOptionPrice}>&#x20b9;349</span>
        </label>
        <label>
          <input type="radio" name="options" value="option3" />

          <span className={styles.radioSpanText}>Ayurvedic head massage</span>
          <span className={styles.radioOptionPrice}>&#x20b9;499</span>
        </label>
        <label>
          <input type="radio" name="options" value="option4" />
          <span className={styles.radioSpanText}>I don't need a massage</span>
        </label>
      </div>
      <div className={styles.action}>
        <span className={styles.totalAmt}>&#x20b9;499</span>
        <button className={styles.cartBtn}>Add to Cart</button>
      </div>
    </div>
  );
};

export default CategoryDetails;
