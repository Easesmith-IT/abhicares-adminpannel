import { Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from "react";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";

const Category = () => {
  const [images, setImages] = useState({
    banner1: { file: null, preview: null },
    banner2: { file: null, preview: null },
    banner3: { file: null, preview: null },
  });

  const [banners, setBanners] = useState({
    banner1: { file: null, preview: null },
    banner2: { file: null, preview: null },
  })

  const bannerChangeHandler = (e, name) => {
    const file = e.target.files[0];

    setBanners((prev) => {
      return {
        ...prev,
        [name]: { file: file, preview: URL.createObjectURL(file) },
      };
    });
  };
  const imageChangeHandler = (e, name) => {
    const file = e.target.files[0];

    setImages((prev) => {
      return {
        ...prev,
        [name]: { file: file, preview: URL.createObjectURL(file) },
      };
    });
  };

  const uploadImages = () => {
    // Create a FormData object to send files
    const formData = new FormData();

    // Append each image file to the FormData object
    Object.values(images).forEach(({ file }, index) => {
      if (file) {
        formData.append(`banner${index + 1}`, file);
      }
    });


    axios.post("your-upload-endpoint", formData);
  };
  return (
    <Wrapper>
      <div>
        <div className='my-3 mx-5'>
          <h3>Category Banners(3)</h3>
        </div>
        <div className={classes.imagesContainer}>
          {Object.keys(images).map((name, index) => (
            <div key={index} className={classes.imageWrapper}>
             
              {images[name].preview && (
                <img src={images[name].preview} alt={`banner${index + 1}`} />
              )}
              <input
                type="file"
                name={name}
                accept="image/*"
                onChange={(event) => imageChangeHandler(event, name)}
                className="mb-2"
              />
            </div>
          ))}
        </div>

        <div className={classes.otherBanners}>
        {Object.keys(banners).map((name, index) => (
            <div key={index} className={classes.bannerContainer} >
               <h4>{`Banner ${index + 1}`}</h4>
              {banners[name].preview && (
                <img src={banners[name].preview} alt={`banner${index + 1}`} />
              )}
              <input
                type="file"
                name={name}
                accept="image/*"
                onChange={(event) => bannerChangeHandler(event, name)}
                className="mb-2"
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mx-5 mt-4">
          <button type="button" class="btn btn-primary" onClick={uploadImages}>
            Update
          </button>
        </div>
      </div>

      
    </Wrapper>
  );
};

export default Category;
