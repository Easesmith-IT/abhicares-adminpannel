import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import classes from "../../AdminPanel/Shared.module.css";
import axios from 'axios';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';


import AddBtn from "../../../assets/add-icon-nobg.png";
import { useNavigate } from 'react-router-dom';
import serviceInfoPageClasses from "./ServiceInfoPage.module.css";
import AddProductModal from '../../../components/add-product-modal/AddProductModal';
import ProductInfoModal from '../../../components/product-info-modal/ProductInfoModal';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import Loader from '../../../components/loader/Loader';

import { MdDelete } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import AddPackageModal from '../../../components/add-package-modal/AddPackageModal';
import Wrapper from '../../Wrapper';

const ServiceInfoPage = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isPackageInfoModalOpen, setIsPackageInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPackageDeleteModalOpen, setIsPackageDeleteModalOpen] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [allPackages, setAllPackages] = useState([]);
    const [product, setProduct] = useState({});
    const [singlePackage, setSinglePackage] = useState("");
    const [isPackageLoading, setIsPackageLoading] = useState(true);
    const [isProductLoading, setIsProductLoading] = useState(true);

    const { state } = useLocation();
    const params = useParams();

    const token = localStorage.getItem("adUx")

    const headers = {
        Authorization: token
    }

    const handleProductInfoModal = (e, product) => {
        e.stopPropagation();
        setProduct(product)
        setIsInfoModalOpen(!isDeleteModalOpen);
    };

    const handlePackageInfoModal = (e, singlePackage) => {
        e.stopPropagation();
        setSinglePackage(singlePackage)
        setIsPackageInfoModalOpen(!isPackageInfoModalOpen);
    };

    const handleUpdateModal = (e, product) => {
        e.stopPropagation();
        setProduct(product)
        setIsUpdateModalOpen(!isDeleteModalOpen);
    };
    const getAllProducts = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-service-product/${params?.serviceId}`, { headers });
            console.log(data);
            setAllProducts(data.data);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsProductLoading(false);
        }
    };
    const getAllPackage = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-service-package/${params?.serviceId}`, { headers });
            console.log(data);
            setAllPackages(data.data);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsPackageLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
        getAllPackage();
    }, [])

    const handleDelete = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-product/${product}`, { headers });
            console.log(product);
            toast.success("Prodct deleted successfully");
            getAllProducts();
            setIsDeleteModalOpen(!isDeleteModalOpen);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteModal = (e, id) => {
        e.stopPropagation();
        setProduct(id);
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const handlePackageDeleteModal = (e, id) => {
        e.stopPropagation();
        setSinglePackage(id);
        setIsPackageDeleteModalOpen(!isPackageDeleteModalOpen);
    };

    const handlePackageDelete = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-package/${singlePackage}`, { headers });
            console.log(data);
            toast.success("Package deleted successfully");
            getAllPackage();
            setIsPackageDeleteModalOpen(!isPackageDeleteModalOpen);
        } catch (error) {
            console.log(error);
        }
    };

    if (!token) {
        navigate('/');
        return;
    }

    return (
        <>
            <Wrapper>
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
                        {!isProductLoading
                            && allProducts.length === 0
                            && <p>No products found</p>
                        }

                        {isProductLoading
                            && allProducts.length === 0
                            && <Loader />
                        }

                        {allProducts?.map((product) => (
                            <div key={product._id} onClick={(e) => handleProductInfoModal(e, product)} className={classes.card}>
                                <img src={`${process.env.REACT_APP_IMAGE_URL}/uploads/${product.imageUrl[0]}`} alt="product" />
                                <div>
                                    <div className={serviceInfoPageClasses.heading_container}>
                                        <h5>{product.name}</h5>
                                        <div className={classes.icon_container}>
                                            <FiEdit onClick={(e) => handleUpdateModal(e, product)} size={20} />
                                            <MdDelete onClick={(e) => handleDeleteModal(e, product._id)} size={22} color='red' />
                                        </div>
                                    </div>
                                    <p>{parse(product.description)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={classes["services-header"]}>
                        <h4>Packages</h4>
                        <button onClick={() => setIsPackageModalOpen(true)} className={classes.services_add_btn}>
                            <img src={AddBtn} alt="add package" />
                        </button>
                    </div>
                    <div className={classes.card_container}>
                        {!isPackageLoading
                            && allPackages.length === 0
                            && <p>No packages found</p>
                        }

                        {isPackageLoading
                            && allPackages.length === 0
                            && <Loader />
                        }
                        {allPackages?.map((singlePackage) => (
                            <div key={singlePackage._id} onClick={(e) => handlePackageInfoModal(e, singlePackage)} className={classes.card}>
                                <img src={`${process.env.REACT_APP_IMAGE_URL}/uploads/${singlePackage.imageUrl[0]}`} alt="package" />
                                <div>
                                    <div className={serviceInfoPageClasses.heading_container}>
                                        <h5>{singlePackage.name}</h5>
                                        <div className={classes.icon_container}>
                                            <MdDelete onClick={(e) => handlePackageDeleteModal(e, singlePackage._id)} size={22} color='red' />
                                        </div>
                                    </div>
                                    {/* <p>{parse(singlePackage.description)}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </Wrapper >

            {isInfoModalOpen && (
                <ProductInfoModal
                    product={product}
                    setIsInfoModalOpen={setIsInfoModalOpen}
                />
            )}

            {isPackageInfoModalOpen && (
                <ProductInfoModal
                    isPackage
                    product={singlePackage}
                    setIsInfoModalOpen={setIsPackageInfoModalOpen}
                />
            )}

            {isModalOpen && (
                <AddProductModal
                    serviceId={params?.serviceId}
                    setIsModalOpen={setIsModalOpen}
                    getAllProducts={getAllProducts}
                />
            )}

            {isPackageModalOpen && (
                <AddPackageModal
                    serviceId={params?.serviceId}
                    setIsModalOpen={setIsPackageModalOpen}
                    getAllPackage={getAllPackage}
                    allProducts={allProducts}
                />
            )}

            {isUpdateModalOpen && (
                <AddProductModal
                    serviceId={params?.serviceId}
                    setIsModalOpen={setIsUpdateModalOpen}
                    product={product}
                    getAllProducts={getAllProducts}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    setState={setIsDeleteModalOpen}
                    handleDelete={handleDelete}
                />
            )}
            {isPackageDeleteModalOpen && (
                <DeleteModal
                    setState={setIsPackageDeleteModalOpen}
                    handleDelete={handlePackageDelete}
                />
            )}
        </>
    );
}

export default ServiceInfoPage