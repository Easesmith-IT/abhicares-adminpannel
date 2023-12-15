import { useState } from 'react';
import classes from './AddCityModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import {useNavigate} from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddCityModal = ({ setIsModalOpen, city = "", getAllCities }) => {
    const [cityInfo, setCityInfo] = useState({
        city: city?.city || "",
        state: city?.state || "",
        pinCode: city?.pinCode || "",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCityInfo({ ...cityInfo, [name]: value });
    }
    const navigate = useNavigate()
    const token = localStorage.getItem("adUx")
    
 
    const headers = {
        Authorization:token
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!cityInfo.city 
            || !cityInfo.pinCode
            || !cityInfo.state
            ) {
            return;
        }
        if (city) {
            try {
                if(!token){
                    navigate('/');
                    return;
                  }
                const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-availabe-city/${city._id}`, { ...cityInfo},{headers});
                console.log(data);
                toast.success("City updated successfully");
                getAllCities();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                if(!token){
                    navigate('/');
                    return;
                  }
                const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-availabe-city  `, { ...cityInfo },{headers});
                console.log(data);
                toast.success("City added successfully");
                getAllCities();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
    }
    if(!token){
        navigate('/');
        return;
      }
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>{city ? "Update" : "Add"} City</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="city">City</label>
                        <input className={classes.input} onChange={handleOnChange} value={cityInfo.city} type="text" name="city" id="city" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="state">State</label>
                        <input className={classes.input} onChange={handleOnChange} value={cityInfo.state} type="text" name="state" id="state" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="pinCode">Pincode</label>
                        <input className={classes.input} onChange={handleOnChange} value={cityInfo.pinCode} type="number" name="pinCode" id="pinCode" />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>{city ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCityModal