import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";
const WebService = () => {
  const [images, setImages] = useState([
    { bannerName: "banner1", file: null, preview: null },
    { bannerName: "banner2", file: null, preview: null },
    { bannerName: "banner3", file: null, preview: null },
  ]);
  const imageChangeHandler = (e, bannerName) => {
    const file = e.target.files[0];

    setImages((prev) =>
      prev.map((img) =>
        img.bannerName === bannerName
          ? { ...img, file: file, preview: URL.createObjectURL(file) }
          : img
      )
    );
  };

  const uploadImages = async () => {
    //for hero section
    const formDataHero = new FormData();

    formDataHero.append("type", "hero-banners");
    formDataHero.append("page", "service");
    formDataHero.append("section", "app-servicepage");
    formDataHero.append("no_of_images", "multiple");

    for (const img of images) {
      formDataHero.append("img", img.file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formDataHero
      );
      // console.log(response3);
      if (response.status === 200) {
        alert("Updated successfully!");
      }
    } catch (err) {
      console.log("ERROR", err.message);
    }
  };
  return (
    <Wrapper>
      <div>
        <div className="my-3 mx-5">
          <h3>Service Banners(3)</h3>
        </div>
        <div className={classes.imagesContainer}>
          {images.map((img, index) => (
            <div key={index} className={classes.imageWrapper}>
              {img.bannerName && img.bannerName.preview && (
                <img src={img.bannerName.preview} alt={`banner${index + 1}`} />
              )}
              <input
                type="file"
                name={img.bannerName}
                accept="image/*"
                onChange={(event) => imageChangeHandler(event, img.bannerName)}
                className="mb-2"
              />
            </div>
          ))}
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

export default WebService;
