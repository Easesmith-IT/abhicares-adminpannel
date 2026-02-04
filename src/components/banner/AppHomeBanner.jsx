import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

import UpdateBannerModal from "../modals/UpdateBannerModal";
import { H4 } from "../shared/typography";

const AppHomeBanner = () => {
  const [heroBanners, setHeroBanners] = useState([
    { bannerName: "hero-banner1", file: null, preview: null },
    { bannerName: "hero-banner2", file: null, preview: null },
    { bannerName: "hero-banner3", file: null, preview: null },
  ]);

  const [banners, setBanners] = useState([
    { bannerName: "banner4", file: null, preview: null },
    { bannerName: "banner5", file: null, preview: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    img: "",
    type: "",
    page: "",
    section: "",
  });

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

  const handleBannerChange = (e, bannerName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updatePreview(file, setBanners, bannerName);
  };

  /* ---------------- open modal ---------------- */
  const openUpdateModal = (file, type) => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setModalData({
      img: file,
      type,
      page: type.startsWith("hero") ? "home-hero-banners" : "home-banners",
      section: "app-homepage",
    });

    setIsModalOpen(true);
  };

  /* ---------------- fetch banners ---------------- */
  const getBannersFromServer = async () => {
    try {
      // HERO BANNERS
      const heroRes = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            page: "home-hero-banners",
            section: "app-homepage",
          },
          withCredentials: true,
        },
      );

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
      const [banner1, banner2] = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_CMS_URL}/get-banners`, {
          params: {
            type: "banner1",
            page: "home-banners",
            section: "app-homepage",
          },
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_APP_CMS_URL}/get-banners`, {
          params: {
            type: "banner2",
            page: "home-banners",
            section: "app-homepage",
          },
          withCredentials: true,
        }),
      ]);

      setBanners([
        {
          bannerName: "banner4",
          file: null,
          preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${banner1.data.banners.image}`,
        },
        {
          bannerName: "banner5",
          file: null,
          preview: `${import.meta.env.VITE_APP_IMAGE_URL}/${banner2.data.banners.image}`,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBannersFromServer();
  }, []);

  return (
    <>
      <div className="m-6 space-y-8">
        {/* HERO BANNERS */}
        <section>
          <H4>Home Page Hero Banners</H4>

          <div className="grid gap-6 md:grid-cols-3">
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

        {/* OTHER BANNERS */}
        <section>
          <H4>Other Banners</H4>

          <div className="grid gap-6 md:grid-cols-2">
            {banners.map((item, index) => (
              <Card key={item.bannerName}>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-medium">Banner {index + 1}</h4>

                  <img
                    src={item.preview}
                    alt=""
                    className="h-40 w-full rounded-md object-cover border"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBannerChange(e, item.bannerName)}
                  />

                  <Button
                    size="sm"
                    variant="abhicares"
                    onClick={() =>
                      openUpdateModal(item.file, `banner${index + 1}`)
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
