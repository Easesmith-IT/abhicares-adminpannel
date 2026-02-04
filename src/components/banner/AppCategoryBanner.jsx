import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import UpdateBannerModal from "../modals/UpdateBannerModal";
import { H4 } from "../shared/typography";

const AppCategoryBanner = () => {
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
  const updatePreview = (file, list, setList, bannerName) => {
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
    updatePreview(file, heroBanners, setHeroBanners, bannerName);
  };

  const handleBannerChange = (e, bannerName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updatePreview(file, banners, setBanners, bannerName);
  };

  /* ---------------- upload handlers ---------------- */
  const openUpdateModal = (file, type) => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setModalData({
      img: file,
      type,
      page: "category-banners",
      section: "app-categorypage",
    });

    setIsModalOpen(true);
  };

  /* ---------------- fetch existing banners ---------------- */
  const getBannersFromServer = async () => {
    try {
      // Hero banners
      const heroRes = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            page: "category-banners",
            section: "app-categorypage",
          },
          withCredentials: true,
        },
      );

      setHeroBanners((prev) =>
        prev.map((b, i) => ({
          ...b,
          preview: heroRes.data?.banners?.[i]
            ? `${import.meta.env.VITE_APP_IMAGE_URL}/${heroRes.data.banners[i].image}`
            : b.preview,
          file: null,
        })),
      );

      // Banner 1
      const banner1 = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "banner1",
            page: "category-banners",
            section: "app-categorypage",
          },
          withCredentials: true,
        },
      );

      // Banner 2
      const banner2 = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "banner2",
            page: "category-banners",
            section: "app-categorypage",
          },
          withCredentials: true,
        },
      );

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
        {/* Hero Banners */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Category Page Hero Banners</h2>

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

        {/* Other Banners */}
        <section>
          <H4 className="mb-4 text-lg font-semibold">Other Banners</H4>

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

export default AppCategoryBanner;
