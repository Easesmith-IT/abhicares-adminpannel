import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../../Wrapper";
import DummyImage from "../../../../assets/dummy.png";
import classes from "../Banner.module.css";

const Home = () => {
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

    setBanners((prev) =>
      prev.map((banner) =>
        banner.bannerName === bannerName
          ? { ...banner, file: file, preview: URL.createObjectURL(file) }
          : banner
      )
    );
  };

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

  const uploadImages = async (type) => {
    //params
    // type='hero-banners','banner1','banner2'

    console.log('type==',type)

    const formDataHero = new FormData();
    const t = type === "banner1" ? 0 : 1;

    if (type === "hero-banners") {
      formDataHero.append("no_of_images", "multiple");
      for (const img of images) {
        if (img.file === null) {
          alert('Please select the images');
          return;
        }
        formDataHero.append("img", img.file);
      }
    } else {
      formDataHero.append("no_of_images", "single");
      if (banners[t].file === null) {
        alert("Please select the images");
        return;
      }
      formDataHero.append("img", banners[t].file);
    }

    formDataHero.append("type", type);

    formDataHero.append("page", "home");
    formDataHero.append("section", "app-homepage");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
        formDataHero
      );

      if (response.status === 200) {
        alert("Updated successfully!");
      }
    } catch (err) {
      console.log("ERROR", err.message);
    }
  };

  const getBannersFromServer = async () => {
    try {
      const response1 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "hero-banners",
            page: "home",
            section: "app-homepage",
          },
        }
      );

      const response2 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "banner1",
            page: "home",
            section: "app-homepage",
          },
        }
      );
      const response3 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "banner2",
            page: "home",
            section: "app-homepage",
          },
        }
      );

      console.log(response1);

      console.log(response2);
      console.log(response3);

      // setImages((prev) =>
      //   prev.map((img, index) => ({
      //     ...img,
      //     preview: response1.data.banners[index],
      //   }))
      // );

      // setBanners((prev) =>
      //   prev.map((banner, index) => ({
      //     ...banner,
      //     preview:
      //       index === 0 ? response2.data.banners[0] : response3.data.banners[0],
      //   }))
      // );
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => uploadImages('hero-banners')}
          >
            Update
          </button>
        </div>
        <div className={classes.imagesContainer}>
          {images &&
            images.map((img, index) => (
              <div key={index} className={classes.imageWrapper}>
                {img.bannerName && img.preview && (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_URL}/uploads/${img.preview}`}
                    alt={`i${index + 1}`}
                  />
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
              </div>
            ))}
        </div>

        <div className={classes.otherBanners}>
          {banners &&
            banners.map((banner, index) => (
              <div key={index} className={classes.bannerContainer}>
                <h4>{`Banner ${index + 1}`}</h4>

                {banner.bannerName && banner.preview && (
                  <img
                    src={`${process.env.REACT_APP_IMAGE_URL}/uploads/${banner.preview}`}
                    alt={`banner${index + 1}`}
                  />
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

export default Home;
