import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from '../Shared.module.css'
import citiesClasses from './AvailableCities.module.css'
import Loader from '../../../components/loader/Loader'
import axios from 'axios'
import AddBtn from "../../../assets/add-icon-nobg.png";

import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'

import Wrapper from '../../Wrapper'
import AddCityModal from '../../../components/add-city-modal/AddCityModal'
import toast from 'react-hot-toast'
import DeleteModal from '../../../components/deleteModal/DeleteModal'

const AvailableCities = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [city, setCity] = useState({});
    const [allCities, setAllCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate()

    const token = localStorage.getItem("adUx")
    const headers = {
        Authorization: token
    }

    const getAllCities = async () => {
        try {
            if (!token) {
                navigate('/');
                return
            }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-availabe-city`, { headers });
            console.log(data);
            setAllCities(data.data);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getAllCities();
    }, [])


    const handleUpdateModal = (city) => {
        setCity(city);
        setIsUpdateModalOpen(!isDeleteModalOpen);
    };

    const handleDeleteModal = (id) => {
        setCity(id);
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const handleDelete = async () => {
        try {
            if (!token) {
                navigate('/');
                return;
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_API_URL}/delete-availabe-city/${city}`, { headers });
            toast.success("City deleted successfully");
            getAllCities();
            setIsDeleteModalOpen(!isDeleteModalOpen);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Wrapper>
                <div className={classes["report-container"]}>
                    <div className={classes["report-header"]}>
                        <h1 className={classes["recent-Articles"]}>Available Cities</h1>
                        <button onClick={() => setIsModalOpen(true)} className={classes.services_add_btn}>
                            <img src={AddBtn} alt="add seller" />
                        </button>
                    </div>

                    <div className={citiesClasses.container}>
                        {!isLoading
                            && allCities?.length === 0
                            && <p>No cities found</p>
                        }

                        {isLoading
                            && allCities?.length === 0
                            && <Loader />
                        }
                        {allCities?.map((city) => (
                            <div key={city._id} className={citiesClasses.city}>
                                <div className={citiesClasses.city_left}>
                                    <p>city: {city.city}</p>
                                    <p>state: {city.state}</p>
                                    <p>pincode: {city.pinCode}</p>
                                </div>
                                <div className={citiesClasses.city_right}>
                                    <FiEdit onClick={() => handleUpdateModal(city)} cursor={"pointer"} size={20} />
                                    <MdDelete onClick={() => handleDeleteModal(city._id)} cursor={"pointer"} size={22} color='red' />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Wrapper>
            {isModalOpen &&
                <AddCityModal
                    setIsModalOpen={setIsModalOpen}
                    getAllCities={getAllCities}
                />
            }

            {isUpdateModalOpen &&
                <AddCityModal
                    setIsModalOpen={setIsUpdateModalOpen}
                    getAllCities={getAllCities}
                    city={city}
                />
            }

            {isDeleteModalOpen &&
                <DeleteModal
                    handleDelete={handleDelete}
                    setState={setIsDeleteModalOpen}
                />
            }
        </>
    )
}

export default AvailableCities