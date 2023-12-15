import { useState } from 'react';
import classes from './AddProductModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import {useNavigate} from 'react-router-dom'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddProductModal = ({ setIsModalOpen, serviceId, product = "", getAllProducts }) => {
    const [description, setDescription] = useState(product?.description || "");
    const [productInfo, setProductInfo] = useState({
        name: product?.name || "",
        price: product?.price || "",
        offerPrice: product?.offerPrice || "",
        img: product?.imageUrl || ["https://www.shutterstock.com/image-photo/interior-hotel-bathroom-260nw-283653278.jpg"],
    });


    const getImage = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files;
        console.log(uploadedImage);
        setProductInfo({ ...productInfo, img: uploadedImage });
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductInfo({ ...productInfo, [name]: value });
    }
    const navigate = useNavigate()
    
    const token = localStorage.getItem("adUx")

        
    const headers = {
        Authorization:token
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!productInfo.name || !productInfo.price || !productInfo.offerPrice || !productInfo.img || !description) {
            return;
        }
        const formData = new FormData();
        formData.append("name", productInfo.name);
        formData.append("price", productInfo.price);
        formData.append("offerPrice", productInfo.offerPrice);
        formData.append("serviceId", serviceId);
        for (const img of productInfo.img) {
            formData.append("img", img);            
        }
        formData.append("description", description);


        if (product) {
            try {
                if(!token){
                    navigate('/');
                    return;
                  }
                const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-product/${product._id}`, formData, {headers});
                toast.success("Product updated successfully");
                getAllProducts();
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
                const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-product`, formData,{headers});
                console.log(data);
                toast.success("Product added successfully");
                getAllProducts();
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
                        <label htmlFor="img">image</label>
                        <input onChange={getImage} multiple type="file" name="img" id="img" />
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