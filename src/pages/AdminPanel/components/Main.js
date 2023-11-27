import React from "react";
import TotalOrdersIcn from "../../../assets/admin-panel/total-orders-icon.png";
import PendingOrdersIcn from "../../../assets/admin-panel/pending-orders.png";
import CancelledOrdersIcn from "../../../assets/admin-panel/cancelled-orders.png";

import classes from "../Shared.module.css";

const Shared = () => {
  return (
    <div className={classes.main}>
      <div className={classes["box-container"]}>
        <div className={`${classes.box} ${classes.box1}`}>
          <div className={classes.text}>
            <h2 className={classes["topic-heading"]}>60.5k</h2>
            <h2 className={classes.topic}>Total Orders</h2>
          </div>
          <img src={TotalOrdersIcn} alt="total-orders" />
        </div>

        <div className={`${classes.box} ${classes.box2}`}>
          <div className={classes.text}>
            <h2 className={classes["topic-heading"]}>1.50K</h2>
            <h2 className={classes.topic}>Completed Orders</h2>
          </div>

          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
            alt="completed-orders"
          />
        </div>

        <div className={`${classes.box} ${classes.box3}`}>
          <div className={classes.text}>
            <h2 className={classes["topic-heading"]}>3.20K</h2>
            <h2 className={classes.topic}>Pending Orders</h2>
          </div>

          <img src={PendingOrdersIcn} alt="pending-orders" />
        </div>

        <div className={`${classes.box} ${classes.box4}`}>
          <div className={classes.text}>
            <h2 className={classes["topic-heading"]}>70</h2>
            <h2 className={classes.topic}>Cancelled Orders</h2>
          </div>

          <img src={CancelledOrdersIcn} alt="cancelled-orders" />
        </div>
      </div>

      <div className={classes["report-container"]}>
        <div className={classes["report-header"]}>
          <h1 className={classes["recent-Articles"]}>Recent Orders</h1>
          <button className={classes.view}>View All</button>
        </div>

        <div className={classes["report-body"]}>
          <div className={classes["report-topic-heading"]}>
            <h3 className={classes["t-op"]}>Order Id</h3>
            <h3 className={classes["t-op"]}>Customer Id</h3>
            <h3 className={classes["t-op"]}>Total Amount</h3>
            <h3 className={classes["t-op"]}>Status</h3>
          </div>

          <div className={classes.items}>
            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>210</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu122</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>360</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu123</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>150</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag--cancelled"]}`}
              >
                Cancelled
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>420</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>190</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>390</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag--cancelled"]}`}
              >
                Cancelled
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>580</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>160</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag"]}`}
              >
                Completed
              </h3>
            </div>

            <div className={classes.item1}>
              <h3 className={classes["t-op-nextlvl"]}>himashu121</h3>
              <h3 className={classes["t-op-nextlvl"]}>customer101</h3>
              <h3 className={classes["t-op-nextlvl"]}>220</h3>
              <h3
                className={`${classes["t-op-nextlvl"]} ${classes["label-tag--cancelled"]}`}
              >
                Cancelled
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shared;
