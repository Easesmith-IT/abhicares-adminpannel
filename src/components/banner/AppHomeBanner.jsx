import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

import UpdateBannerModal from "../modals/UpdateBannerModal";
import { H4 } from "../shared/typography";
import useCrashReporter from "../../hooks/useCrashReporter";
import { readCookie } from "../../utils/readCookie";
import usePostApiReq from "../../hooks/usePostApiReq";

const AppHomeBanner = () => {
  const [heroBanners, setHeroBanners] = useState([
    { bannerName: "hero-banner1", file: null, preview: null },
    { bannerName: "hero-banner2", file: null, preview: null },
    { bannerName: "hero-banner3", file: null, preview: null },
  ]);

  const [banners, setBanners] = useState([
    { bannerName: "review1", file: null, preview: null },
    { bannerName: "review2", file: null, preview: null },
    { bannerName: "review3", file: null, preview: null },
  ]);
  const [videos, setVideos] = useState([
    { bannerName: "review1", file: null, preview: null },
    { bannerName: "review2", file: null, preview: null },
    { bannerName: "review3", file: null, preview: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    img: "",
    type: "",
    page: "",
    section: "",
  });

  const { reportCrash } = useCrashReporter();
  const adminInfo = readCookie("adminInfo");

  /* ---------------- image handlers ---------------- */
  const updatePreview = (file, setList, bannerName) => {
    const reader = new FileReader();
    reader.onload = () => {
      setList((prev) =>
        prev.map((b) =>
          b.bannerName === bannerName
            ? { ...b, file, preview: reader.result }
            : b,
        ),
      );
    };
    reader.readAsDataURL(file);
  };

  const handleHeroChange = (e, bannerName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updatePreview(file, setHeroBanners, bannerName);
  };

  // const handleBannerChange = (e, bannerName) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   updatePreview(file, setBanners, bannerName);
  // };

  const handleBannerChange = (e, bannerName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate video type
    if (!file.type.startsWith("video/")) {
      toast.success("Please upload a valid video");
      return;
    }

    const preview = URL.createObjectURL(file);

    setVideos((prev) =>
      prev.map((b) =>
        b.bannerName === bannerName ? { ...b, file, preview } : b,
      ),
    );
  };

  /* ---------------- open modal ---------------- */
  // const openUpdateModal = (file, type) => {
  //   if (!file) {
  //     toast.error("Please select an image");
  //     return;
  //   }

  //   setModalData({
  //     img: file,
  //     type,
  //     page: type.startsWith("hero") ? "home-hero-banners" : "home-banners",
  //     section: "app-homepage",
  //   });

  //   setIsModalOpen(true);
  // };

  const { res, fetchData, isLoading } = usePostApiReq();

  const openUpdateModal = (file, type) => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

      setModalData({
        img: file,
        type,
        page: "home",
        section: "app-hero-banner",
      });

    // const formData = new FormData();
    // formData.append("img", file);
    // formData.append("type", type);
    // formData.append("page", "home");
    // formData.append("section", "app-hero-banner");

    // fetchData("/content/upload-banners", formData);

     setIsModalOpen(true);
  };

  // useEffect(() => {
  //   if (res?.status === 200 || res?.status === 201) {
  //     //  toast.success("Banner updated successfully");
  //     getBannersFromServer();
  //   }
  // }, [res]);

  const openUpdateModal2 = (file, type) => {
    if (!file) {
      toast.error("Please select a video");
      return;
    }

    setModalData({
      video: file,
      type,
      // page: type.startsWith("hero") ? "home-hero-banners" : "home-banners",
      page: "home",
      section: "app-review-video",
    });

    const formData = new FormData();
    formData.append("video", file);
    formData.append("type", type);
    formData.append("page", "home");
    formData.append("section", "app-review-video");

    fetchData("/content/upload-video", formData);
  };

   const getVideoFromServer = async () => {
     try {
       const videoRes = await axios.get(
         `${import.meta.env.VITE_APP_CMS_URL}/get-videos`,
         {
           params: {
             reviewVideos: true,
             type: "video",
             page: "home",
             section: "app-review-video",
           },
           withCredentials: true,
         },
       );

       console.log("videoRes", videoRes);
       

       setVideos((prev) =>
         prev.map((v, i) => ({
           ...v,
           preview: videoRes.data?.videos?.[i]
             ? `${import.meta.env.VITE_APP_IMAGE_URL}/${videoRes.data.videos[i].video}`
             : null,
           file: null,
         })),
       );
     } catch (err) {
       console.error(err);
       reportCrash({
         error: err,
         screenName: "AppHomeBanner",
         severity: "HIGH",
         request: {
           url: "/get-banners",
           method: "GET",
         },
         userType: "ADMIN",
         userId: adminInfo?.id,
       });
     }
   };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      //  toast.success("Banner updated successfully");
      // getBannersFromServer();
      getVideoFromServer();
    }
  }, [res]);



  const getBannersFromServer = async () => {
    try {
      // HERO BANNERS
      const heroRes = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            type: "hero-banner",
            page: "home",
            section: "app-hero-banner",
          },
          withCredentials: true,
        },
      );

      console.log("heroRes", heroRes);

      setHeroBanners((prev) =>
        prev.map((b, i) => ({
          ...b,
          preview: heroRes.data?.banners?.[i]
            ? `${import.meta.env.VITE_APP_IMAGE_URL}/${heroRes.data.banners[i].image}`
            : null,
          file: null,
        })),
      );

      // OTHER BANNERS
      // const [banner1, banner2] = await Promise.all([
      //   axios.get(`${import.meta.env.VITE_APP_CMS_URL}/get-banners`, {
      //     params: {
      //       type: "banner1",
      //       page: "home-banners",
      //       section: "app-homepage",
      //     },
      //     withCredentials: true,
      //   }),
      //   axios.get(`${import.meta.env.VITE_APP_CMS_URL}/get-banners`, {
      //     params: {
      //       type: "banner2",
      //       page: "home-banners",
      //       section: "app-homepage",
      //     },
      //     withCredentials: true,
      //   }),
      // ]);

      // setBanners([
      //   {
      //     bannerName: "banner4",
      //     file: null,
      //     preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${banner1.data.banners.image}`,
      //   },
      //   {
      //     bannerName: "banner5",
      //     file: null,
      //     preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${banner2.data.banners.image}`,
      //   },
      // ]);
    } catch (err) {
      console.error(err);
      reportCrash({
        error: err,
        screenName: "AppHomeBanner",
        severity: "HIGH",
        request: {
          url: "/get-banners",
          method: "GET",
        },
        userType: "ADMIN",
        userId: adminInfo?.id,
      });
    }
  };

  useEffect(() => {
    getBannersFromServer();
    getVideoFromServer();
  }, []);

  return (
    <>
      <div className="space-y-8">
        {/* HERO BANNERS */}
        <section>
          <H4>Home Page Hero Banners</H4>

          <div className="grid gap-6 md:grid-cols-3 mt-4">
            {heroBanners.map((item, index) => (
              <Card key={item.bannerName}>
                <CardContent className="p-4 space-y-3">
                  <img
                    src={item.preview}
                    alt=""
                    className="h-40 w-full rounded-md object-cover border"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroChange(e, item.bannerName)}
                  />

                  <Button
                    size="sm"
                    variant="abhicares"
                    onClick={() =>
                      openUpdateModal(item.file, `hero-banner${index + 1}`)
                    }
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <H4>Review Videos</H4>

          <div className="grid gap-6 md:grid-cols-3">
            {videos.map((item, index) => (
              <Card key={item.bannerName}>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium">Video {index + 1}</h4>

                  <video
                    src={item.preview}
                    className="h-40 w-full rounded-md object-cover border"
                    controls
                  />

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleBannerChange(e, item.bannerName)}
                  />

                  <Button
                    size="sm"
                    variant="abhicares"
                    onClick={() =>
                      openUpdateModal2(item.file, `video${index + 1}`)
                    }
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Update Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <UpdateBannerModal
          setIsModalOpen={setIsModalOpen}
          getBannersFromServer={getBannersFromServer}
          data={modalData}
        />
      )}
    </>
  );
};

export default AppHomeBanner;
