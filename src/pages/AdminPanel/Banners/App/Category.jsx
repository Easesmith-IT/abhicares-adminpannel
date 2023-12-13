import { Link } from "react-router-dom";
import axios from 'axios';
import React, { useState } from "react";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";

const Category = () => {
  const [images, setImages] = useState([
    { bannerName: "banner1", file: null, preview: null },
    { bannerName: "banner2", file: null, preview: null },
    { bannerName: "banner3", file: null, preview: null },
  ]);

  const [banners, setBanners] = useState([
    { bannerName: "banner4", file: null, preview: null },
    { bannerName: "banner5", file: null, preview: null },
  ]);

  const bannerChangeHandler = (e, bannerName) => {
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", function () {
      console.log(this.result);
      const index = banners.findIndex((banner) => banner.bannerName === bannerName);
      console.log("index", index);
      const instance = [...banners];
      instance.splice(index, 1, { bannerName, file, preview: this.result })
      setBanners(instance);
    });
  };


  const imageChangeHandler = (e, bannerName) => {
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", function () {
      console.log(this.result);
      const index = images.findIndex((banner) => banner.bannerName === bannerName);
      const instance = [...images];
      instance.splice(index, 1, { bannerName, file, preview: this.result })
      setImages(instance);
    });
  };

  const uploadImages = async () => {
    //for hero section
    const formDataHero = new FormData();

    formDataHero.append("type", "hero-banners");
    formDataHero.append("page", "category");
    formDataHero.append("section", "app-categorypage");
    formDataHero.append("no_of_images", "multiple");

    for (const img of images) {
      formDataHero.append("img", img.file);
    }

    // for banner1

    const formDataBan1 = new FormData();

    formDataBan1.append("type", "banner1");
    formDataBan1.append("page", "category");
    formDataBan1.append("section", "app-categorypage");
    formDataBan1.append("no_of_images", "single");
    formDataBan1.append("img", banners[0].file);

    // for banner2

    const formDataBan2 = new FormData();

    formDataBan2.append("type", "banner2");
    formDataBan2.append("page", "category");
    formDataBan2.append("section", "app-categorypage");
    formDataBan2.append("no_of_images", "single");
    formDataBan2.append("img", banners[1].file);

    try {
      const response1 = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formDataHero
      );
      const response2 = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formDataBan1
      );
      console.log(response2);
      const response3 = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formDataBan2
      );

      if (response1.status === 200 && response2.status === 200 && response3.status === 200) {
        alert('Updated successfully!')
      }

      // console.log(response3);
    } catch (err) {
      console.log("ERROR", err.message);
    }
  };
  return (
    <Wrapper>
      <div>
        <div className="my-3 mx-5">
          <h3>Hero Banners(3)</h3>
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

        <div className={classes.otherBanners}>
          {banners.map((banner, index) => (
            <div key={index} className={classes.bannerContainer}>
              <h4>{`Banner ${index + 1}`}</h4>
              {banner.bannerName && banner.bannerName.preview && (
                <img
                  src={banner.bannerName.preview}
                  alt={`banner${index + 1}`}
                />
              )}
              <input
                type="file"
                name={banner.bannerName}
                accept="image/*"
                onChange={(event) =>
                  bannerChangeHandler(event, banner.bannerName)
                }
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

export default Category;
