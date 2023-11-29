import { useState } from 'react';
import classes from './AddProductModal.module.css';
import { RxCross2 } from 'react-icons/rx';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProductModal = ({ setIsModalOpen, serviceId, product = "", getAllProducts }) => {
    console.log(product);
    const [description, setDescription] = useState(product?.description || "");
    const [productInfo, setProductInfo] = useState({
        name: product?.name || "",
        price: product?.price || "",
        offerPrice: product?.offerPrice || "",
        imageUrl: product?.imageUrl || ["https://www.shutterstock.com/image-photo/interior-hotel-bathroom-260nw-283653278.jpg"],
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductInfo({ ...productInfo, [name]: value });
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!productInfo.name || !productInfo.price || !productInfo.offerPrice || !productInfo.imageUrl || !description) {
            return;
        }
        if (product) {
            try {
                const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/update-product/${product._id}`, { ...productInfo,serviceId, description });
                console.log(data);
                toast.success("Product updated successfully");
                getAllProducts();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/create-product`, { ...productInfo, serviceId, description });
                console.log(data);
                toast.success("Product added successfully");
                getAllProducts();
                setIsModalOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>{product ? "Update" : "Add"} Product</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Name</label>
                        <input className={classes.input} onChange={handleOnChange} value={productInfo.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="price">Price</label>
                        <input className={classes.input} onChange={handleOnChange} value={productInfo.price} type="number" name="price" id="price" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="offerPrice">Offer Price</label>
                        <input className={classes.input} onChange={handleOnChange} value={productInfo.offerPrice} type="number" name="offerPrice" id="offerPrice" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="description">Description</label>
                        <ReactQuill theme="snow" value={description} onChange={setDescription} />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="imageUrl">imageUrl</label>
                        <input onChange={handleOnChange} type="file" name="imageUrl" id="imageUrl" />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>{product ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProductModal