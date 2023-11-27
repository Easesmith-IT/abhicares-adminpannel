import React from "react";
import { connect } from "react-redux";
import classes from "./CartPage.module.css";

const CartPage = (props) => {
  console.log("these are the items", props.items);
  return (
    <div className={classes["cart-container"]}>
      <h2 className={classes.center}>My Cart</h2>
      <div className={classes.horizontalLine}></div>
      <div>
        {props.items.map((item) => (
          <div key={item.id}>
            <div className={classes.products_details}>
              <div
                className={classes.img_heading_box}
                style={{ border: "2px solid" }}
              >
                <div>
                  <img src={item.img} width={120} height={120} alt="..." />
                </div>
                <div>
                  <h5>{item.name}</h5>
                  <p>{item.id}</p>
                </div>
              </div>
              <div>
                <h5>{item.amount}</h5>
              </div>
              <div>
                <button
                  type="button"
                  className={`btn-close ${classes.removeItemBtn}`}
                  aria-label="Close"
                ></button>
              </div>
              <div>
                <h5>{item.price}</h5>
              </div>
            </div>
            <div className={classes.horizontalLine}></div>
          </div>
        ))}
      </div>
      <div className={classes.cart_summary}>
        <div>
          <p> Discount: ₹ 1200</p>
        </div>
        <div>
          <p>Sub-Total: ₹ 130090</p>
        </div>
        <div>
          <p>Total: ₹ 140090</p>
        </div>
      </div>

      <div className={classes.action_btns}>
        <div className={classes.promo_text}>
          <p>If you have any promo code enter it here:</p>
          <input
            type="text"
            id="promo-code"
            name="promo-code"
            placeholder="Enter code here..."
          />
        </div>

        <button>Apply Discount</button>
        <div className={classes.action_btns_col}>
          <button>Checkout</button>
          <button>Continue Shopping</button>
        </div>
      </div>
      <button>Click me</button>
    </div>
  );
};

const mapToProps = (state) => {
  return {
    items: state.items,
    totalAmount: state.totalAmount,
  };
};

export default connect(mapToProps)(CartPage);

//  <React.Fragment>
//       <h1 style={{ marginLeft: "1.5rem" }}>
//         Save 15% on every order for just &#x20b9;64 extra{" "}
//       </h1>
//       <p style={{ marginLeft: "1.5rem" }}>
//         You will save &#x20b9;135 on this order
//       </p>
//       <div className={classes.categoryContainer}>
//         <div className={classes.detailsContainer}>
//           <div>
//             <h4>Other benefits</h4>
//             <ul>
//               <li>
//                 <span>100% moneyback guarantee</span>
//                 <span>
//                   If you save less than your membership price we refund you the
//                   difference
//                 </span>
//               </li>
//               <li>
//                 <span>Top rated professionals</span>
//                 <span>
//                   Get exclusively trained UC professionals at your service
//                 </span>
//               </li>
//             </ul>
//           </div>
//           <div>
//             <h2>Estimated Savings</h2>
//             <h1>&#x20b9;1440</h1>
//             <p>No. of services per year</p>
//             <div className={classes.noOfServices}>
//               <p>2</p>
//               <p>4</p>
//               <p>6</p>
//               <p>8</p>
//               <p>10</p>
//               <p>12</p>
//             </div>
//             <p>
//               <i>Subscribers placed 6 orders on average in your area</i>
//             </p>
//           </div>
//           <h4>Plus in numbers</h4>
//           <div className={classes.container3}>
//             {PLUS_IN_NUMBERS.map((card) => {
//               return (
//                 <div className={classes.container3Card}>
//                   <h6>{card.title}</h6>
//                   <p>{card.text}</p>
//                 </div>
//               );
//             })}
//           </div>

//           <Faq />
//         </div>

//         <div className={classes.sideContainer}>
//           <h4 className={classes.center}>Select your plan</h4>
//           <div className={classes.cartDiv}>
//             <span>
//               <h3>6 months</h3>
//               <p>&#x20b9;199</p>
//             </span>

//             <button>Add</button>
//           </div>
//           <h5 className={classes.center} style={{ color: "rgb(130,38,8)" }}>
//             No I will pay the full price
//           </h5>

//           <div className={classes.footerPrice}>
//             <p>&#x20b9;898</p>
//             <button>Proceed</button>
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
