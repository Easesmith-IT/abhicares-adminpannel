import { useState } from 'react';
import classes from './AddServiceModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddServiceModal = ({ setIsModalOpen }) => {
    const [description, setDescription] = useState("");
    
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>Add Service</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Name</label>
                        <input className={classes.input} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="startingPrice">Starting Price</label>
                        <input className={classes.input} type="number" name="startingPrice" id="startingPrice" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="description">Description</label>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="imageUrl">imageUrl</label>
                        <input type="file" name="imageUrl" id="imageUrl" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="totalProducts">Total Products</label>
                        <input className={classes.input} type="number" name="totalProducts" id="totalProducts" />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddServiceModal