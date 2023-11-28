import React, { useState } from 'react';
import Header from '../AdminPanel/components/Header'
import { useNavigate } from 'react-router-dom';
import SideNav from '../AdminPanel/components/SideNav';
import AddBtn from "../../assets/add-icon-nobg.png";

import classes from "../AdminPanel/Shared.module.css";
import categoryServicesClasses from "./CategoryServices.module.css";
import AddServiceModal from '../../components/add-service-modal/AddServiceModal';

const CategoryServices = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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
                        <div className={classes["services-header"]}>
                            <h2>Category</h2>
                            <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                                <img src={AddBtn} alt="add service" />
                            </button>
                        </div>
                        <div className={classes.card_container}>
                            <div onClick={() => navigate("/admin/services/:123/product/:1234")} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Service name</h5>
                                    <p>Service desc</p>
                                </div>
                            </div>
                            <div onClick={() => navigate("/admin/services/:123/product/:1234")} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Service name</h5>
                                    <p>Service desc</p>
                                </div>
                            </div>
                            <div onClick={() => navigate("/admin/services/:123/product/:1234")} className={classes.card}>
                                <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                <div>
                                    <h5>Service name</h5>
                                    <p>Service desc</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {isModalOpen &&
                <AddServiceModal
                    setIsModalOpen={setIsModalOpen}
                />
            }
        </>
    )
}

export default CategoryServices