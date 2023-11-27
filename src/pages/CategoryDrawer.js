import React from "react";
import Modal from "../components/UI/Modal";

import SubCategoryItems from "../components/HomePageComponents/SubCategoryItems";

const DUMMY_CATEGORIES = [
  {
    id: "c1",
    key: "1",
    title: "Home Repair",
    rating: "4.84 (9.5 M bookings)",
    subCategories: ["Electrician", "Plumber", "Painter", "Carpenter"],
  },
  {
    id: "c2",
    key: "2",
    title: "Appliance Repair",
    rating: "4.84 (9.5 M bookings)",
    subCategories: [
      "Air Conditioner",
      "Air Purifier",
      "Refrigerator",
      "Washing Machine",
      "Microwave",
      "Television",
      "Mixer",
      "Geyser",
      "Inverter(UPS)",
      "Chimney",
    ],
  },
  {
    id: "c3",
    key: "3",
    title: "Personal Care",
    rating: "4.84 (9.5 M bookings)",
    subCategories: [
      "Salon/Spa for women",
      "Salon/Massage for men",
      "Bridal/Party Makeup",
      "Mehendi Artist",
    ],
  },
];

const CategoryDrawer = (props) => {
  const chosenCategory = DUMMY_CATEGORIES.find(
    (category) => category.id === props.chosenCategoryId
  );
  return (
    <React.Fragment>
      <Modal onClick={props.onClick}>
        <SubCategoryItems category={chosenCategory} />
      </Modal>
    </React.Fragment>
  );
};

export default CategoryDrawer;
