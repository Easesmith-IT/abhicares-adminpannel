import React from "react";
import { Link } from "react-router-dom";
import DummyImg from "../../assets/mainCategories/paint.jpg";

import classes from "./BestOffers.module.css";
const BestOffers = () => {
  const BEST_OFFERS = [
    {
      title: "Salon Prime For kids and Mens",
      key: "bo1",
      text: "Haircut at 199",
    },
    {
      title: "Salon Prime",
      key: "bo2",
      text: "Upto 50% off",
    },
    {
      title: "Massage For Men",
      key: "bo3",
      text: "Relaxing therapies starting at 499",
    },
    {
      title: "Bathroom and Kitchen cleaning",
      key: "bo4",
      text: "Relaxing therapies starting at 499",
    },
  ];

  return (
    <div className={classes["bestoffer-container"]}>
      <div>
        <h2 className={classes.center}>Best Offers</h2>
        <h6 className={classes.center}>
          Hygienic & single-use products | low-contact services
        </h6>
      </div>

      <div className={classes.parentContainer}>
        {BEST_OFFERS.map((offer) => (
          <div className={classes.offerEl}>
            <Link key={offer.key}>
              <img src={DummyImg} alt="demo" className={classes.img} />
              <h5 className={classes.center}>{offer.title}</h5>
              <p className={`${classes.center} ${classes.offer_description}`}>
                {offer.text}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestOffers;
