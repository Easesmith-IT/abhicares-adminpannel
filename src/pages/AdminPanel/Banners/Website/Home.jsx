import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Wrapper from "../../../Wrapper";
import DummyImage from "../../../../assets/dummy.png";
import classes from "../Banner.module.css";
import toast from "react-hot-toast";

const WebHome = () => {
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

  const uploadImages = async (type) => {
    //params
    // type='hero-banners','banner1','banner2'

    console.log('type==', type)

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
    formDataHero.append("section", "web-homepage");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/content/upload-banners",
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

  console.log("images",images);

  const getBannersFromServer = async () => {
    try {
      const response1 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "hero-banners",
            page: "home",
            section: "web-homepage",
          },
        }
      );

      const imgInstance = [...images];
      let i = 0;
      for (const img of response1.data.banners) {
        i = i + 1;
        const index = images.findIndex((banner) => banner.bannerName === `banner${i}`);
        imgInstance.splice(index, 1, { bannerName: `banner${i}`, file: `${process.env.REACT_APP_IMAGE_URL}/uploads/${img}`, preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${img}` })
      }
      setImages(() => imgInstance);

      const response2 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "banner1",
            page: "home",
            section: "web-homepage",
          },
        }
      );

      const instance = [...banners];
      const index = banners.findIndex((banner) => banner.bannerName === "banner4");
      instance.splice(index, 1, { bannerName: "banner4", file: null, preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${response2.data.banners[0]}` })
      setBanners(() => instance);

      const response3 = await axios.get(
        "http://localhost:5000/api/content/get-banners",
        {
          params: {
            type: "banner2",
            page: "home",
            section: "web-homepage",
          },
        }
      );

      const index2 = banners.findIndex((banner) => banner.bannerName === "banner5");
      instance.splice(index2, 1, { bannerName: "banner5", file: null, preview: `${process.env.REACT_APP_IMAGE_URL}/uploads/${response3.data.banners[0]}` })
      setBanners(() => instance);

      console.log(response1);

      console.log(response2);
      console.log(response3);

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
                    src={img.preview}
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
                    src={banner.preview}
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

export default WebHome;
