import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import classes from "../AdminPanel/Shared.module.css";
import axios from 'axios';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';


import AddBtn from "../../assets/add-icon-nobg.png";

import SideNav from '../AdminPanel/components/SideNav'
import Header from '../AdminPanel/components/Header'
import serviceInfoPageClasses from "./ServiceInfoPage.module.css";
import AddProductModal from '../../components/add-product-modal/AddProductModal';
import ProductInfoModal from '../../components/product-info-modal/ProductInfoModal';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import Loader from '../../components/loader/Loader';

import { MdDelete } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';

const ServiceInfoPage = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState({});

    const { state } = useLocation();
    const params = useParams();

    const toggleMenuHandler = () => {
        setShowMenu((prev) => !prev);
    };

    const handleProductInfoModal = (e, product) => {
        e.stopPropagation();
        setProduct(product)
        setIsInfoModalOpen(!isDeleteModalOpen);
    };

    const handleUpdateModal = (e, product) => {
        e.stopPropagation();
        setProduct(product)
        setIsUpdateModalOpen(!isDeleteModalOpen);
    };

    const handleDeleteModal = (e, id) => {
        e.stopPropagation();
        setProduct(id);
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/delete-product/${product}`);
            console.log(product);
            toast.success("Prodct deleted successfully");
            getAllProducts();
            setIsDeleteModalOpen(!isDeleteModalOpen);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/get-service-product/${params?.serviceId}`);
            console.log(data);
            setAllProducts(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [])

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
                        <div className={serviceInfoPageClasses.service_info}>
                            <h4>{state.name}</h4>
                            <div>
                                <p>Starting Price: ₹{state.startingPrice}</p>
                                <p>Total Products: {state.totalProducts}</p>
                            </div>
                            <p>{parse(state.description)}</p>
                        </div>
                        <div className={classes["services-header"]}>
                            <h4>Products</h4>
                            <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                                <img src={AddBtn} alt="add product" />
                            </button>
                        </div>
                        <div className={classes.card_container}>
                        {allProducts.length === 0 && <Loader />}
                            {allProducts?.map((product) => (
                                <div key={product._id} onClick={(e) => handleProductInfoModal(e,product)} className={classes.card}>
                                    <img src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg" alt="product" />
                                    <div>
                                        <div className={serviceInfoPageClasses.heading_container}>
                                            <h5>{product.name}</h5>
                                            <div className={classes.icon_container}>
                                                <FiEdit onClick={(e) => handleUpdateModal(e, product)} size={20} />
                                                <MdDelete onClick={(e) => handleDeleteModal(e, product._id)} size={22} color='red' />
                                            </div>
                                        </div>
                                        <p>Product desc</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {isInfoModalOpen &&
                <ProductInfoModal
                    product={product}
                    setIsInfoModalOpen={setIsInfoModalOpen}
                />
            }

            {isModalOpen &&
                <AddProductModal
                    serviceId={params?.serviceId}
                    setIsModalOpen={setIsModalOpen}
                    getAllProducts={getAllProducts}
                />
            }

            {isUpdateModalOpen &&
                <AddProductModal
                    serviceId={params?.serviceId}
                    setIsModalOpen={setIsUpdateModalOpen}
                    product={product}
                    getAllProducts={getAllProducts}
                />
            }

            {isDeleteModalOpen &&
                <DeleteModal
                    setState={setIsDeleteModalOpen}
                    handleDelete={handleDelete}
                />
            }
        </>
    )
}

export default ServiceInfoPage