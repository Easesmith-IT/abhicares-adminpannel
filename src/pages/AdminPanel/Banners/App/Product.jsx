import { Link } from "react-router-dom";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";
import { useState } from "react";

const Product = () => {
  const [image, setImage] = useState({
    banner: { file: null, preview: null },
  });

  const bannerChangeHandler = (e) => {
    const file = e.target.files[0];

    setImage({ file: file, preview: URL.createObjectURL(file) });
  };

  const uploadImages = () => {
   
    // axios.post("your-upload-endpoint", formData);
  };

  return (
    <Wrapper>
      {" "}
      <div className={classes.otherBanners}>
        <div className={classes.bannerContainer}>
          <h4>Product Banner</h4>
          {image.preview && (
            <img src={image.preview} alt='banner' />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => bannerChangeHandler(event)}
            className="mb-2"
          />
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

export default Product;
