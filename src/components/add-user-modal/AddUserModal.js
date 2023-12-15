import { useState } from 'react';
import classes from './AddUserModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import ReactQuill from 'react-quill';
import {useNavigate} from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddUserModal = ({ setIsModalOpen, user = "", getAllUsers }) => {
    console.log(user);
    const [userInfo, setUserInfo] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        password: "",
        gender: user?.gender || "",
        status: user?.status || true
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    }
    const navigate = useNavigate()
    const token = localStorage.getItem("adUx")
    
 
    const headers = {
        Authorization:token
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo.name 
            || !userInfo.phone
            || !userInfo.password
            || !userInfo.gender
            || !userInfo.status
            ) {
                alert("alert")
            return;
        }
        if (user) {
            try {
                if(!token){
                    navigate('/');
                    return;
                  }
                const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-user/${user._id}`, { ...userInfo},{headers});
                console.log(data);
                toast.success("User updated successfully");
                getAllUsers();
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
                const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-user`, { ...userInfo },{headers});
                console.log(data);
                toast.success("User added successfully");
                getAllUsers();
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
                    <h4>{user ? "Update" : "Add"} User</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Name</label>
                        <input className={classes.input} onChange={handleOnChange} value={userInfo.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="phone">Phone</label>
                        <input className={classes.input} onChange={handleOnChange} value={userInfo.phone} type="number" name="phone" id="phone" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="password">Password</label>
                        <input className={classes.input} onChange={handleOnChange} value={userInfo.password} type="password" name="password" id="password" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="gender">Gender</label>
                        <input className={classes.input} onChange={handleOnChange} value={userInfo.gender} type="text" name="gender" id="gender" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="status">Status</label>
                        <select onChange={handleOnChange} value={userInfo.status} className={classes.input} name="status" id="status">
                            <option value="true">Active</option>
                            <option value="false">InActive</option>
                        </select>
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>{user ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserModal