import React from "react";
import {connect} from 'react-redux'
import CartItem from "./CartItem";
import CartIcon from "../../assets/empty-cart.png";

import classes from "./Cart.module.css";
const Cart = (props) => {

  if (props.items.length === 0) {
 return (
      <React.Fragment>
        <div className={classes.cartContainer}>
          <div className={classes.cartIcon}>
            <img src={CartIcon} alt="empty-cart-icon" />
          </div>

          <div>
            <p className={classes.center}>No items in cart.</p>
          </div>
        </div>
      </React.Fragment>
    );
}


 return (
    <div className={classes.cartItemContainer}>
      <div>
        {props.items.map((item) => (
          <CartItem item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
    
  }

const mapStateToProps = (state) => {
  return {
      items:state.items,
    }
  }
 


export default connect(mapStateToProps)(Cart);
