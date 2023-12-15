import { useEffect, useState } from 'react';
import classes from './AddSellerModal.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate} from 'react-router-dom'

import { RxCross2 } from 'react-icons/rx';
import { IoIosArrowDown } from "react-icons/io";


const AddSellerModal = ({ setIsModalOpen, seller = "", getAllSellers }) => {
    const [sellerInfo, setSellerInfo] = useState({
        name: seller?.name || "",
        legalName: seller?.legalName || "",
        gstNumber: seller?.gstNumber || "",
        phone: seller?.phone || "",
        password: seller?.password || "",
        categoryId: seller?.categoryId || "",
        services: seller?.services || [],
    });

    const [address, setAddress] = useState({
        state: seller?.address?.state || "",
        city: seller?.address?.city || "",
        addressLine: seller?.address?.addressLine || "",
        pincode: seller?.address?.pincode || "",
    });

    const [coordinates, setCoordinates] = useState({
        latitude: seller?.address?.location?.coordinates[0] || "",
        longitude: seller?.address?.location?.coordinates[1] || "",
    });

    const [contactPerson, setContactPerson] = useState({
        name: seller?.contactPerson?.name || "",
        phone: seller?.contactPerson?.phone || "",
        email: seller?.contactPerson?.email || "",
    });
    const [allCategories, setAllCategories] = useState([]);
    const [allCategoryServices, setAllCategoryServices] = useState([]);
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);


    const handleServiceOnChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSellerInfo({ ...sellerInfo, services: [...sellerInfo.services, { serviceId: value }] })
        }
        else {
            const filtered = sellerInfo.services.filter((service) => service !== value);
            setSellerInfo({ ...sellerInfo, services: filtered })
        }
    }

    const handleContactPersonOnChange = (e) => {
        const { name, value } = e.target;
        setContactPerson({ ...contactPerson, [name]: value });
    }

    const handleLocationOnChange = (e) => {
        const { name, value } = e.target;
        setCoordinates({ ...coordinates, [name]: value });
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setSellerInfo({ ...sellerInfo, [name]: value });
        setAddress({ ...address, [name]: value });
    }

    const token = localStorage.getItem("adUx")
    const navigate = useNavigate()
   
    const headers = {
        Authorization:token
    }
    const getAllCategories = async () => {

        try {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-all-category`,{headers})
            setAllCategories(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, [])

    const getCategoryServices = async () => {
        try {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.get(`${process.env.REACT_APP_ADMIN_API_URL}/get-category-service/${sellerInfo.categoryId}`,{headers});
            // console.log(data);
            setAllCategoryServices(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategoryServices();
    }, [sellerInfo.categoryId])
  




    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            toast.error("Geolocation not supported");
        }

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // setLocation({ ...location, coordinates: [latitude, longitude] });
            toast.success("Location got");
        }

        function error() {
            toast.error("Unable to retrieve your location");
        }
    }




    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!sellerInfo.name
            || !sellerInfo.legalName
            || !sellerInfo.gstNumber
            || !sellerInfo.phone
            || !sellerInfo.password
            || !sellerInfo.categoryId
            || !address.addressLine
            || !address.city
            || !address.pincode
            || !address.state
            || !contactPerson.name
            || !contactPerson.email
            || !contactPerson.phone
        ) {
            return;
        }
        const allData = {
            name: sellerInfo.name,
            legalName: sellerInfo.legalName,
            gstNumber: sellerInfo.gstNumber,
            phone: sellerInfo.phone,
            password: sellerInfo.password,
            status: sellerInfo.status,
            categoryId: sellerInfo.categoryId,
            services: sellerInfo.services,
            address: {
                state: address.state,
                city: address.city,
                pincode: address.pincode,
                addressLine: address.addressLine,
                location: {
                    coordinates: [coordinates.latitude, coordinates.longitude]
                }
            },
            contactPerson
        }
    console.log(allData);

        if (seller) {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-seller/${seller._id}`, allData,{headers});
            console.log(data);
            toast.success("Seller updated successfully");
            getAllSellers();
            setIsModalOpen(false);
        }
        else {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-seller`, allData,{headers});
            console.log(data);
            toast.success("Seller added successfully");
            getAllSellers();
            setIsModalOpen(false);
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
                    <h4>{seller ? "Update" : "Add"} Seller</h4>
                    <div className={classes.d_flex}>
                        <RxCross2 onClick={() => setIsModalOpen(false)} cursor={"pointer"} size={26} />
                    </div>
                </div>
                <form onSubmit={handleOnSubmit} className={classes.form}>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Name</label>
                        <input className={classes.input} onChange={handleOnChange} value={sellerInfo.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="legalName">Legal Name</label>
                        <input className={classes.input} onChange={handleOnChange} value={sellerInfo.legalName} type="text" name="legalName" id="legalName" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="gstNumber">GST Number</label>
                        <input className={classes.input} onChange={handleOnChange} value={sellerInfo.gstNumber} type="text" name="gstNumber" id="gstNumber" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="phone">Phone</label>
                        <input className={classes.input} onChange={handleOnChange} value={sellerInfo.phone} type="text" name="phone" id="phone" />
                    </div>
                    {!seller && <div className={classes.input_container}>
                        <label htmlFor="password">Password</label>
                        <input className={classes.input} onChange={handleOnChange} value={sellerInfo.password} type="password" name="password" id="password" />
                    </div>}
                    <div className={classes.input_container}>
                        <label htmlFor="state">State</label>
                        <input className={classes.input} onChange={handleOnChange} value={address.state} type="text" name="state" id="state" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="city">City</label>
                        <input className={classes.input} onChange={handleOnChange} value={address.city} type="text" name="city" id="city" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="addressLine">Address Line</label>
                        <input className={classes.input} onChange={handleOnChange} value={address.addressLine} type="text" name="addressLine" id="addressLine" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="pincode">Pincode</label>
                        <input className={classes.input} onChange={handleOnChange} value={address.pincode} type="text" name="pincode" id="pincode" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="name">Contact Person Name</label>
                        <input className={classes.input} onChange={handleContactPersonOnChange} value={contactPerson.name} type="text" name="name" id="name" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="phone">Contact Person Phone</label>
                        <input className={classes.input} onChange={handleContactPersonOnChange} value={contactPerson.phone} type="text" name="phone" id="phone" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="email">Contact Person Email</label>
                        <input className={classes.input} onChange={handleContactPersonOnChange} value={contactPerson.email} type="email" name="email" id="email" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="categoryId">Category</label>
                        <select onChange={handleOnChange}  className={classes.input} name="categoryId" id="categoryId">
                            <option value={"choose a category"}>choose a category</option>
                            {allCategories?.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    {sellerInfo.categoryId && <div className={classes.input_container}>
                        <label htmlFor="servicesId">Services</label>
                        <div onClick={() => setIsMultiSelectOpen(!isMultiSelectOpen)} className={`${classes.input} ${classes.d_flex}`}>
                            select service
                            <IoIosArrowDown />
                        </div>
                        {isMultiSelectOpen &&
                            <div className={classes.multi_select}>
                                {allCategoryServices?.map((service) => (
                                    <div key={service._id} className={classes.d_flex}>
                                        <label htmlFor={service.name}>{service.name}</label>
                                        <input checked={sellerInfo.services.some((item)=> item.serviceId === service._id)} onChange={handleServiceOnChange} type="checkbox" value={service._id} name={service.name} id={service.name} />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>}
                    <div className={classes.input_container}>
                        <label htmlFor="latitude">Latitude</label>
                        <input className={classes.input} onChange={handleLocationOnChange} value={coordinates.latitude} type="text" name="latitude" id="latitude" />
                    </div>
                    <div className={classes.input_container}>
                        <label htmlFor="longitude">Longitude</label>
                        <input className={classes.input} onChange={handleLocationOnChange} value={coordinates.longitude} type="text" name="longitude" id="longitude" />
                    </div>
                    {/* <button type='button' className={classes.button} onClick={handleLocationClick}>Get Location</button> */}

                    <div className={classes.button_wrapper}>
                        <button type='submit' className={classes.button}>{seller ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSellerModal