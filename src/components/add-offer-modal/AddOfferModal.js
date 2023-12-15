import { useState } from 'react';
import classes from './AddOfferModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const validateCouponCode = (code) => {
    const hasSpaces = /\s/.test(code);
    
    const hasUpperCaseLetters = [...code].every(
      (char) => char === char.toUpperCase()
    );
    
    if (!hasSpaces && hasUpperCaseLetters) {
        return true;
    }

    return false;

}

const AddOfferModal = ({ setIsModalOpen, offer = "", getAllOffers }) => {
    const [description, setDescription] = useState(offer?.description || "");
    const [offerInfo, setOfferInfo] = useState({
        name: offer?.name || "",
        offPercentage: offer?.offPercentage || "",
        // date: offer?.date || "",
        status: offer?.status || true,
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setOfferInfo({ ...offerInfo, [name]: value });
    }
    const navigate = useNavigate()
    const token = localStorage.getItem("adUx")


    const headers = {
        Authorization: token
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!offerInfo.name
            || !offerInfo.offPercentage
            || !description
        ) {
            return;
        }
        if (offer) {
            try {
                if (!token) {
                    navigate('/');
                    return;
                }
                const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-coupon/${offer._id}`, { ...offerInfo, description }, { headers });
                console.log(data);
                toast.success("Offer updated successfully");
                getAllOffers();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                if (!token) {
                    navigate('/');
                    return;
                }

                if (!validateCouponCode(offerInfo.name)) {
                    toast.error('Please enter valid coupon code');
                    return;
                }
                const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-coupon`, { ...offerInfo, description }, { headers });
                console.log(data);
                toast.success("Offer added successfully");
                getAllOffers();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
    }
    if (!token) {
        navigate('/');
        return;
    }
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>{offer ? "Update" : "Add"} Offer</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Coupon Code (in block letters and without space)</label>
                        <input className={classes.input} onChange={handleOnChange} value={offerInfo.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="offPercentage">Offer Percentage</label>
                        <input className={classes.input} onChange={handleOnChange} value={offerInfo.offPercentage} type="number" name="offPercentage" id="offPercentage" />
                    </div>
                    {/* <div className={classes.input_container}>
                        <label htmlFor="date">Date</label>
                        <input className={classes.input} onChange={handleOnChange} value={offerInfo.date} type="date" name="date" id="date" />
                    </div> */}
                    {offer && <div className={classes.input_container}>
                        <label htmlFor="status">Status</label>
                        <select className={classes.input} name="status" id="status">
                            <option value="true">Active</option>
                            <option value="false">InActive</option>
                        </select>
                    </div>}
                    <div className={classes.input_container}>
                        <label htmlFor="description">Description</label>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>{offer ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddOfferModal