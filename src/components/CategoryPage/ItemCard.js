import React from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";


import SwitchImg from "../../assets/category/swtich.jpg";
import FanImg from "../../assets/category/fan.jpg";
import BulbImg from "../../assets/category/bulb.jpg";

import classes from "./ItemCard.module.css";

const ITEMS = [
  {
    id: "i1",
    name: "Switch Replacement",
    rating: "4.85 (15K reviews)",
    price: 300,
    amount: 1,
    offers: "",
    description:
      "These product details can be one sentence, a short paragraph or bulleted. They can be serious, funny or quirky.",
    img: SwitchImg,
  },
  {
    id: "i2",
    name: "Fan Repair",
    rating: "4.00 (10K reviews)",
    amount: 1,
    price: 100,
    offers: "",
    description:
      "These product details can be one sentence, a short paragraph or bulleted. They can be serious, funny or quirky.",
    img: FanImg,
  },
  {
    id: "i3",
    name: "Bulb Repair",
    rating: "3.85 (20K reviews)",
    amount: 1,
    price: 150,
    offers: "",
    description:
      "These product details can be one sentence, a short paragraph or bulleted. They can be serious, funny or quirky.",
    img: BulbImg,
  },
];

// console.log("cid", cId);
// "/:categoryId/categories/:serviceId/details"
// http://localhost:3000/c1/categories/c1/categories/i1/details

const ItemCard = (props) => {
  const cId = useParams().categoryId;


 

  return (
    <div className={classes["product-list"]}>
      {ITEMS.map((item) => (
        <div className={classes.wrapper} key={item.id}>
          <div className={classes["product-info"]}>
            <Link
              to="/:categoryId/categories/:serviceId/details"
              className={classes["product-text"]}
            >
              <h4>{item.name}</h4>
              <p>{item.rating}</p>
              <p>{item.description}</p>
            </Link>
            <div className={classes["product-price-btn"]}>
              <p>
                <span className={classes.span}>&#x20b9;{item.price}</span>
              </p>
              <button
                type="button"
                onClick={props.onAddItemToCart.bind(null, item)}
                className={classes["add-to-cart-btn"]}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className={classes["product-img"]}>
            <img src={item.img} height="250" width="250" alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};



const mapDispatchToProps = (dispatch) => {
  return {
    onAddItemToCart:(item)=>dispatch({type:'ADD_ITEM',item})
  }
}

export default connect(null,mapDispatchToProps) (ItemCard);

