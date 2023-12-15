import { useState } from 'react';
import classes from './AddPackageModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import {useNavigate} from 'react-router-dom'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IoIosArrowDown } from 'react-icons/io';

const AddPackageModal = ({ setIsModalOpen, serviceId, getAllPackage, allProducts }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem("adUx")

    const headers = {
        Authorization: token
    }

    const [packageInfo, setPackageInfo] = useState({
        name: "",
        price: "",
        offerPrice: "",
        img: ["https://www.shutterstock.com/image-photo/interior-hotel-bathroom-260nw-283653278.jpg"],
        products: [],
    });
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);



    const getImage = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files;
        setPackageInfo({ ...packageInfo, img: uploadedImage });
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setPackageInfo({ ...packageInfo, [name]: value });
    }

    const handleProductOnChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setPackageInfo({ ...packageInfo, products: [...packageInfo.products, { productId: value }] })
        }
        else {
            const filtered = packageInfo.products.filter((product) => product.productId !== value);
            setPackageInfo({ ...packageInfo, products: filtered })
        }
    }


    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (
            !packageInfo.name
            || !packageInfo.price
            || !packageInfo.offerPrice
            || !packageInfo.img
            ) {
            return;
        }
        const formData = new FormData();
        formData.append("name", packageInfo.name);
        formData.append("price", packageInfo.price);
        formData.append("offerPrice", packageInfo.offerPrice);
        formData.append("serviceId", serviceId);
        formData.append("products", JSON.stringify(packageInfo.products));
        for (const img of packageInfo.img) {
            formData.append("img", img);
        }


        try {
            if (!token) {
              navigate("/");
              return;
            }
            const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-package`, formData,{headers});
            toast.success("Package added successfully");
            getAllPackage();
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    }
if (!token) {
  navigate("/");
  return;
}
    return (
        <div className={classes.wrapper}>
            <div className={classes.modal}>
                <div className={classes.heading_container}>
                    <h4>Add Package</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Name</label>
                        <input className={classes.input} onChange={handleOnChange} value={packageInfo.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="price">Price</label>
                        <input className={classes.input} onChange={handleOnChange} value={packageInfo.price} type="number" name="price" id="price" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="offerPrice">Offer Price</label>
                        <input className={classes.input} onChange={handleOnChange} value={packageInfo.offerPrice} type="number" name="offerPrice" id="offerPrice" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="Products">Products</label>
                        <div onClick={() => setIsMultiSelectOpen(!isMultiSelectOpen)} className={`${classes.input} ${classes.d_flex}`}>
                            select product
                            <IoIosArrowDown />
                        </div>
                        {isMultiSelectOpen &&
                            <div className={classes.multi_select}>
                                {allProducts?.map((product) => (
                                    <div key={product._id} className={classes.d_flex}>
                                        <label htmlFor={product.name}>{product.name}</label>
                                        <input checked={packageInfo.products.some((item)=> item.productId === product._id)} onChange={handleProductOnChange} type="checkbox" value={product._id} name={product.name} id={product.name} />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="img">image</label>
                        <input onChange={getImage} multiple type="file" name="img" id="img" />
                    </div>
                    <div className={classes.button_wrapper}>
                        <button className={classes.button}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPackageModal