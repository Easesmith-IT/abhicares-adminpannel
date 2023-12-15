import { useState } from 'react';
import classes from './AddServiceModal.module.css';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddServiceModal = ({ setIsModalOpen, categoryId, service = "", getCategoryServices }) => {
    const [description, setDescription] = useState(service?.description || "");
    const [serviceInfo, setServiceInfo] = useState({
        name: service?.name || "",
        startingPrice: service?.startingPrice || "",
        img: service?.img || "https://www.shutterstock.com/image-photo/interior-hotel-bathroom-260nw-283653278.jpg",
        appHomepage: service?.appHomepage || false,
        webHomepage: service?.webHomepage || false,
        // totalProducts: service?.totalProducts || ""
    });

    const getImage = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        console.log(uploadedImage);
        setServiceInfo({ ...serviceInfo, img: uploadedImage });
    }

    console.log(serviceInfo.img);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setServiceInfo({ ...serviceInfo, [name]: value });
    }
    const token = localStorage.getItem("adUx")
    const navigate = useNavigate()
    const headers = {
        Authorization:token
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!serviceInfo.name || !serviceInfo.startingPrice || !serviceInfo.img || !description) {
            return;
        }
        const formData = new FormData();
        formData.append("name", serviceInfo.name);
        formData.append("startingPrice", serviceInfo.startingPrice);
        formData.append("description", description);
        formData.append("appHomepage", serviceInfo.appHomepage);
        formData.append("webHomepage", serviceInfo.webHomepage);
        formData.append("img", serviceInfo.img);
        formData.append("categoryId", categoryId);

        if (service) {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.patch(`${process.env.REACT_APP_ADMIN_API_URL}/update-service/${service._id}`, formData,{headers});
            console.log(data);
            toast.success("Service updated successfully");
            getCategoryServices();
            setIsModalOpen(false);
        }
        else {
            if(!token){
                navigate('/');
                return;
              }
            const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_API_URL}/create-service`, formData,{headers});
            toast.success("Service added successfully");
            getCategoryServices();
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
            <h4>{service ? "Update" : "Add"} Service</h4>
            <div className={classes.d_flex}>
              <RxCross2
                onClick={() => setIsModalOpen(false)}
                cursor={"pointer"}
                size={26}
              />
            </div>
          </div>
          <form onSubmit={handleOnSubmit} className={classes.form}>
            <div className={classes.input_container}>
              <label htmlFor="name">Name</label>
              <input
                className={classes.input}
                onChange={handleOnChange}
                value={serviceInfo.name}
                type="text"
                name="name"
                id="name"
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor="startingPrice">Starting Price</label>
              <input
                className={classes.input}
                onChange={handleOnChange}
                value={serviceInfo.startingPrice}
                type="number"
                name="startingPrice"
                id="startingPrice"
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor="description">Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor="imageUrl">imageUrl</label>
              <input
                onChange={getImage}
                type="file"
                name="imageUrl"
                id="imageUrl"
              />
            </div>
            <div className={classes.input_container}>
              <label htmlFor="appHomepage">App Homepage</label>
              <select
                onChange={handleOnChange}
                value={serviceInfo.appHomepage}
                className={classes.input}
                name="appHomepage"
                id="appHomepage"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className={classes.input_container}>
              <label htmlFor="webHomepage">Web Homepage</label>
              <select
                onChange={handleOnChange}
                value={serviceInfo.webHomepage}
                className={classes.input}
                name="webHomepage"
                id="webHomepage"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            {/* <div className={classes.input_container}>
                        <label htmlFor="totalProducts">Total Products</label>
                        <input className={classes.input} onChange={handleOnChange} value={serviceInfo.totalProducts} type="number" name="totalProducts" id="totalProducts" />
                    </div> */}
            <div className={classes.button_wrapper}>
              <button className={classes.button}>
                {service ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default AddServiceModal