import React from "react";


import classes from "./CartItem.module.css";
const CartItem = (props) => {



  return (
    <li className={classes["cart-item"]}>
      <div className={classes.itemName}>
        <p>{props.item.name}</p>
      </div>
      <div>
        <span className="badge text-bg-success">
          &#x20b9;{props.item.price}
        </span>
      </div>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-primary"
          // onClick={removeItemHandler.bind(null, props.item.id)}
        >
          −
        </button>
        <button type="button" className="btn btn-primary">
          {props.item.amount}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          // onClick={addItemHandler.bind(null, props.item)}
        >
          +
        </button>
      </div>
    </li>
  );
};

export default CartItem;
