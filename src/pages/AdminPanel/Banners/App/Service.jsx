import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState,useEffect } from "react";
import Wrapper from "../../../Wrapper";
import toast from "react-hot-toast";
import classes from "../Banner.module.css";
const Service = () => {
  const [images, setImages] = useState([
    { bannerName: "hero-banner1", file: null, preview: null },
    { bannerName: "hero-banner2", file: null, preview: null },
    { bannerName: "hero-banner3", file: null, preview: null },
  ]);

  const imageChangeHandler = (e, bannerName) => {
    const file = e.target.files[0];
    console.log(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", function () {
      console.log(this.result);
      const index = images.findIndex(
        (banner) => banner.bannerName === bannerName
      );
      const instance = [...images];
      instance.splice(index, 1, { bannerName, file, preview: this.result });
      setImages(instance);
    });
  };


  const uploadHeroImages = async (type) => {
    console.log(type);
    const formDataHero = new FormData();
    let filtered = images.find((image) => image.bannerName === type);
    console.log("filtered img", filtered);
    if (filtered && filtered.file === null) {
      toast.error("Please select the image");
      return;
    }
    formDataHero.append("img", filtered.file);
    formDataHero.append("type", type);

    formDataHero.append("page", "service-banners");
    formDataHero.append("section", "app-servicepage");

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
      const response1 = await axios.get(
        `${process.env.REACT_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            page: "service-banners",
            section: "app-servicepage",
          },
        }
      );

      const imgInstance = [...images];
      for (let i = 0; i < response1.data.banners.length; i++) {
        const img = response1.data.banners[i];
        const bannerName = `hero-banner${i + 1}`;
        const index = images.findIndex(
          (banner) => banner.bannerName === bannerName
        );

        if (index !== -1) {
          imgInstance.splice(index, 1, {
            bannerName: bannerName,
            file: `${process.env.REACT_APP_IMAGE_URL}/uploads/${img}`,
            preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${img}`,
          });
        }
      }
      setImages(imgInstance);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getBannersFromServer();
  }, []);
  return (
    <Wrapper>
      <div>
        <div className="my-3 mx-5 d-flex justify-content-between">
          <h3>Service Banners(3)</h3>
        </div>
        <div className={classes.imagesContainer}>
          {images &&
            images.map((img, index) => (
              <div key={index} className={classes.imageWrapper}>
                {img.bannerName && img.preview && (
                  <img src={img.preview} alt={`i${index + 1}`} />
                )}
                <input
                  type="file"
                  name={img.bannerName}
                  accept="image/*"
                  onChange={(event) =>
                    imageChangeHandler(event, img.bannerName)
                  }
                  className="mb-2"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => uploadHeroImages(`hero-banner${index + 1}`)}
                >
                  Update
                </button>
              </div>
            ))}
        </div>

      </div>
    </Wrapper>
  );
};

export default Service;
