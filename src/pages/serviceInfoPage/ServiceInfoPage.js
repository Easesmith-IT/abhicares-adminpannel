import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import SideNav from '../AdminPanel/components/SideNav'
import Header from '../AdminPanel/components/Header'

import AddBtn from "../../assets/add-icon-nobg.png";

import classes from "../AdminPanel/Shared.module.css";
import serviceInfoPageClasses from "./ServiceInfoPage.module.css";
import AddProductModal from '../../components/add-product-modal/AddProductModal';
import ProductInfoModal from '../../components/product-info-modal/ProductInfoModal';

const ServiceInfoPage = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const toggleMenuHandler = () => {
        setShowMenu((prev) => !prev);
    };

    return (
        <>
            <div>
                <Header onClick={toggleMenuHandler} />

                <div className={classes["main-container"]}>
                    <div
                        className={`${classes.navcontainer} ${showMenu ? classes.navclose : ""
                            }`}
                    >
                        <SideNav />
                    </div>
                    <div className={classes["services-wrapper"]}>
                        <div className={serviceInfoPageClasses.service_info}>
                            <h4>Service Name</h4>
                            <div>
                                <p>Starting Price: 500</p>
                                <p>Total Products: 5</p>
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem molestias quis placeat veniam reiciendis modi, officia sapiente maxime itaque enim earum vel minus ipsam perspiciatis a. Laboriosam, corrupti ex? Non!
                            </p>
                        </div>
                        <div className={classes["services-header"]}>
                            <h4>Products</h4>
                            <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                                <img src={AddBtn} alt="add product" />
                            </button>
                        </div>
                        <div className={classes.card_container}>
                            <div onClick={() => setIsInfoModalOpen(true)} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Product name</h5>
                                    <p>Product desc</p>
                                </div>
                            </div>
                            <div onClick={() => setIsInfoModalOpen(true)} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Product name</h5>
                                    <p>Product desc</p>
                                </div>
                            </div>
                            <div onClick={() => setIsInfoModalOpen(true)} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Product name</h5>
                                    <p>Product desc</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {isModalOpen &&
                <AddProductModal
                    setIsModalOpen={setIsModalOpen}
                />
            }
            {isInfoModalOpen &&
                <ProductInfoModal
                    setIsInfoModalOpen={setIsInfoModalOpen}
                />
            }
        </>
    )
}

export default ServiceInfoPage