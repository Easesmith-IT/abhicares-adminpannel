import { useState } from 'react';
import classes from './AddResoulationModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import { useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddResoulationModal = ({ setIsModalOpen, id, getAllIssues }) => {
    console.log(id);
    const [resoulationInfo, setResoulationInfo] = useState({
        resolution: "",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setResoulationInfo({ ...resoulationInfo, [name]: value });
    }
    const navigate = useNavigate()
    const token = localStorage.getItem("adUx")


    const headers = {
        Authorization: token
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!resoulationInfo.resolution) {
            return;
        }
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-help-list/${id}`, { ...resoulationInfo }, { headers });
            console.log(data);
            toast.success("Issue resolved successfully");
            getAllIssues();
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
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
                    <h4>Add Resoulation</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="resolution">Resolution</label>
                        <input className={classes.input} onChange={handleOnChange} value={resoulationInfo.resolution} type="text" name="resolution" id="resolution" />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button onClick={handleOnSubmit} className={classes.button}>Resolve</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddResoulationModal