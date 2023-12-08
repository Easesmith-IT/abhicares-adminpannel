import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ItemCard from "../CategoryPage/ItemCard";
// import Cart from "../Cart/Cart";
import logo from "../../assets/logo .png";
import DummyVideo from "../../assets/videos/dummy-video.mp4";
import Icn from "../../assets/human.png";


import classes from "./CategoryPage.module.css";

const ProductPageHeader = () => {
  return (
    <div>
      <div className={classes.header}>
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className={classes.logo} />
          </Link>
        </div>
        <div className={classes.input_fields}>
          <select>
            <option value="">Select a location</option>
            <option value="location1">Delhi-NCR</option>
            <option value="location2">Lucknow</option>
            <option value="location2">Kanpur</option>
            <option value="location2">Kota</option>
          </select>
          <input type="text" placeholder="Search for a services..." />
        </div>
      </div>
      <div className={classes.horizontalLine}></div>
    </div>
  );
};

const CategoryPage = (props) => {

  return (
    <React.Fragment>
      <ProductPageHeader />
      <div className={classes.media_section}>
        <div className={classes.wrapper}>
          <div className={classes.info}>
            <h3>Hair studio for women</h3>
            <p>4.82(786k bookings)</p>
          </div>
        </div>
        <div className={classes.video_container}>
          <video height={520} width={1020} autoPlay>
            <source src={DummyVideo} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className={classes.mainContainer_wrapper}>
        <div className={classes.mainContainer}>
          <div className="row">
            <div className="col-4">
              <div id="list-example" className="list-group">
                <a
                  className="list-group-item list-group-item-action"
                  href="#list-item-1"
                >
                  Item 1
                </a>
                <a
                  className="list-group-item list-group-item-action"
                  href="#list-item-2"
                >
                  Item 2
                </a>
                <a
                  className="list-group-item list-group-item-action"
                  href="#list-item-3"
                >
                  Item 3
                </a>
                <a
                  className="list-group-item list-group-item-action"
                  href="#list-item-4"
                >
                  Item 4
                </a>
              </div>
            </div>
            <div className="col-8">
              <div
                data-bs-spy="scroll"
                data-bs-target="#list-example"
                data-bs-smooth-scroll="true"
                className="scrollspy-example"
                tabIndex="0"
              >
                <h4 id="list-item-1">Item 1</h4>
                <p>...</p>
                <h4 id="list-item-2">Item 2</h4>
                <p>...</p>
                <h4 id="list-item-3">Item 3</h4>
                <p>...</p>
                <h4 id="list-item-4">Item 4</h4>
                <p>...</p>
              </div>
            </div>
          </div>
          <div className={classes.middleContainer}>
            <ItemCard />
          </div>
          <div className={classes.rightContainer}>
            {/* <Cart /> */}
            <div className={classes.offersContainer}>
              <p className={classes.center}>Offers will be listed here.</p>
            </div>

            {/* {cartCtx.items.length > 0 && (
              <div>
                <div className="d-flex justify-content-around align-items-center">
                  <h6>Sub-Total:</h6>
                  <h3 className="m-0"> &#x20b9; {cartCtx.totalAmount}</h3>
                </div>
                <div className="text-center">
                  <button
                    className={`btn btn-success ${classes["proceed-btn"]}`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <div className={classes.cartBtn_mobile}>
        <button>View Cart</button>
      </div>
    </React.Fragment>
  );
};
export default CategoryPage;


