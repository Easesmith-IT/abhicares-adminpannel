import { Link } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";
import { useState } from "react";

const WebProduct = () => {
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
 
    const formData = new FormData();
    formData.append("type", "product-banner");
    formData.append("page", "product");
    formData.append("section", "app-productpage");
    formData.append("no_of_images", "single");
    formData.append("img", image.file)
    
    console.log('imgfile',image.file)


    try {
      const response = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formData
      );
      console.log(response);
    } catch (err) {
      console.log("ERROR", err.message);
    }
  };

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

export default WebProduct;
