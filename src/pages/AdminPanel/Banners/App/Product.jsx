import { Link } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";
import toast from "react-hot-toast";
import { useState,useEffect } from "react";

const Product = () => {
  const [image, setImage] = useState({
      file: null, preview: null,
  });

  const bannerChangeHandler = (e) => {
    const file = e.target.files[0];

    setImage(() => {
      return {
        file: file,
        preview: URL.createObjectURL(file),
      }
    })
  };

  const uploadImages = async () => {
   
    const formDataHero = new FormData();
      if (image.file === null) {
        alert("Please select the images");
        return;
    }
    
      formDataHero.append("img", image.file);
    

    formDataHero.append("type", "product-banner");

    formDataHero.append("page", "product-banners");
    formDataHero.append("section", "app-productpage");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_CMS_URL}/upload-banners`,
        formDataHero
      );

      if (response.status === 200) {
        getBannersFromServer();
        toast.success("Updated successfully!");
      }
    } catch (err) {
      console.log("ERROR", err.message);
    }
  };

  const getBannersFromServer = async () => {
    try {
 

      const response = await axios.get(
        `${process.env.REACT_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "product-banner",
            page: "product-banners",
            section: "app-productpage",
          },
        }
      );

      setImage({
        file: null, preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${response.data.banners}`
      })
      console.log("response1", response);
    } catch (err) {
      console.log(err.message);
    }
  };


  useEffect(() => {
    getBannersFromServer();
  }, []);

  return (
    <Wrapper>
      <div className={classes.otherBanners}>
        <div className={classes.bannerContainer}>
          <h4>Product Banner</h4>
          {image.preview && (
            <img src={image.preview} alt="banner" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => bannerChangeHandler(event)}
            className="mb-2"
          />
        </div>
        <div className="d-flex justify-content-end mx-5 mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={uploadImages}
          >
            Update
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Product;
