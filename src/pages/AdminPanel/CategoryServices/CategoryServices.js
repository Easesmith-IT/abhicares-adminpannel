import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import classes from "../Shared.module.css";
import AddBtn from "../../../assets/add-icon-nobg.png";
import axios from 'axios';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';

import categoryServicesClasses from "./CategoryServices.module.css";
import AddServiceModal from '../../../components/add-service-modal/AddServiceModal';
import DeleteModal from '../../../components/deleteModal/DeleteModal';
import Loader from '../../../components/loader/Loader';

import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import Wrapper from '../../Wrapper';

const CategoryServices = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [allCategoryServices, setAllCategoryServices] = useState([]);
    const [service, setService] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { state } = useLocation();
    const params = useParams();

    const token = localStorage.getItem("adUx")
    const headers = {
        Authorization: token
    }



    const handleUpdateModal = (e, service) => {
        e.stopPropagation();
        setService(service)
        setIsUpdateModalOpen(!isDeleteModalOpen);
    };

    const handleDeleteModal = (e, id) => {
        e.stopPropagation();
        setService(id);
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };
    const getCategoryServices = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-category-service/${params?.categoryId}`, { headers });
            console.log(data);
            setAllCategoryServices(data.data);
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategoryServices();
    }, [])



    const handleDelete = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-service/${service}`, { headers });
            toast.success("Service deleted successfully");
            getCategoryServices();
            setIsDeleteModalOpen(!isDeleteModalOpen);
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
                    <div className={classes["services-header"]}>
                        <h2>{state.categoryName}</h2>
                        <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                            <img src={AddBtn} alt="add service" />
                        </button>
                    </div>
                    <div className={classes.card_container}>
                        {!isLoading
                            && allCategoryServices.length === 0
                            && <p>No service found</p>
                        }

                        {isLoading
                            && allCategoryServices.length === 0
                            && <Loader />
                        }

                        {allCategoryServices?.map((service) => (
                            <div key={service._id} onClick={() => navigate(`/admin/services/${params?.categoryId}/product/${service._id}`, { state: service })} className={classes.card}>
                                <img src={`${process.env.REACT_APP_IMAGE_URL}/uploads/${service.imageUrl}`} alt="product" />
                                <div>
                                    <div className={categoryServicesClasses.heading_container}>
                                        <h5>{service.name}</h5>
                                        <div className={classes.icon_container}>
                                            <FiEdit onClick={(e) => handleUpdateModal(e, service)} size={20} />
                                            <MdDelete onClick={(e) => handleDeleteModal(e, service._id)} size={22} color='red' />
                                        </div>
                                    </div>
                                    <p>{parse(service.description)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </Wrapper>
            {isModalOpen &&
                <AddServiceModal
                    setIsModalOpen={setIsModalOpen}
                    categoryId={params?.categoryId}
                    getCategoryServices={getCategoryServices}
                />
            }

        {isUpdateModalOpen && (
          <AddServiceModal
            setIsModalOpen={setIsUpdateModalOpen}
            service={service}
            getCategoryServices={getCategoryServices}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            setState={setIsDeleteModalOpen}
            handleDelete={handleDelete}
          />
        )}
      </>
    );
}

export default CategoryServices