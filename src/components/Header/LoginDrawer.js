import React from "react";
import Modal from "../UI/Modal";

import styles from "./LoginDrawer.module.css";
const LoginDrawer = (props) => {
  return (
    <React.Fragment>
      {props.isDrawerShown && (
        <Modal onClick={props.toggleDrawer}>
          <h3>Please Login to continue</h3>
          <input className={styles.input} type="number" min={10} />
          <div>
            <button className={styles.btn}>Continue</button>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default LoginDrawer;
