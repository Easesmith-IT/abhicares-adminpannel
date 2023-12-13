import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Wrapper from "../../../Wrapper";
import classes from "../Banner.module.css";
import toast from "react-hot-toast";

const Category = () => {
  const [images, setImages] = useState([
    { bannerName: "hero-banner1", file: null, preview: null },
    { bannerName: "hero-banner2", file: null, preview: null },
    { bannerName: "hero-banner3", file: null, preview: null },
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
      const index = banners.findIndex(
        (banner) => banner.bannerName === bannerName
      );
      console.log("index", index);
      const instance = [...banners];
      instance.splice(index, 1, { bannerName, file, preview: this.result });
      setBanners(instance);
    });
  };

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

  const uploadImages = async (type) => {
    //params
    // type='hero-banners','banner1','banner2'

    console.log("type==", type);

    const formDataHero = new FormData();
    const t = type === "banner1" ? 0 : 1;

    if (banners[t].file === null) {
      alert("Please select the images");
      return;
    }

    formDataHero.append("img", banners[t].file);

    formDataHero.append("type", type);

    formDataHero.append("page", "category-banners");
    formDataHero.append("section", "app-categorypage");

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

    formDataHero.append("page", "category-banners");
    formDataHero.append("section", "app-categorypage");

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
            page: "category-banners",
            section: "app-categorypage",
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

      const response2 = await axios.get(
        `${process.env.REACT_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "banner1",
            page: "category-banners",
            section: "app-categorypage",
          },
        }
      );
      console.log("rs 2 bann", response2);

      const instance = [...banners];
      const index = banners.findIndex(
        (banner) => banner.bannerName === "banner4"
      );
      instance.splice(index, 1, {
        bannerName: "banner4",
        file: null,
        preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${response2.data.banners}`,
      });
      setBanners(() => instance);

      const response3 = await axios.get(
        `${process.env.REACT_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "banner2",
            page: "category-banners",
            section: "app-categorypage",
          },
        }
      );

      const index2 = banners.findIndex(
        (banner) => banner.bannerName === "banner5"
      );
      instance.splice(index2, 1, {
        bannerName: "banner5",
        file: null,
        preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${response3.data.banners}`,
      });
      setBanners(() => instance);
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
          <h3>Hero Banners(3)</h3>
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

        <div className={classes.otherBanners}>
          {banners &&
            banners.map((banner, index) => (
              <div key={index} className={classes.bannerContainer}>
                <h4>{`Banner ${index + 1}`}</h4>

                {banner.bannerName && banner.preview && (
                  <img src={banner.preview} alt={`banner${index + 1}`} />
                )}
                <div className={classes.bannerFooter}>
                  <input
                    type="file"
                    name={banner.bannerName}
                    accept="image/*"
                    onChange={(event) =>
                      bannerChangeHandler(event, banner.bannerName)
                    }
                    className="mb-2"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => uploadImages(`banner${index + 1}`)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="d-flex justify-content-end mx-5 mt-4"></div>
      </div>
    </Wrapper>
  );
};

export default Category;
