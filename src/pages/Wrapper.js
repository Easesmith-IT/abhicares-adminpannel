import React, { Children, useState } from 'react'
import Header from './AdminPanel/components/Header'

import classes from "../pages/AdminPanel/Shared.module.css";
import SideNav from './AdminPanel/components/SideNav';

const Wrapper = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenuHandler = () => {
        setShowMenu((prev) => !prev);
    };
    return (
        <div>
            <Header onClick={toggleMenuHandler} />

            <div className={classes["main-container"]}>
                <div
                    className={`${classes.navcontainer} ${showMenu ? classes.navclose : ""
                        }`}
                >
                    <SideNav />
                </div>
                {children}
            </div>
        </div>
    )
}

export default Wrapper