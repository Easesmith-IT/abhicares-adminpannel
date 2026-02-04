import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

import UpdateBannerModal from "../modals/UpdateBannerModal";
import { H4 } from "../shared/typography";

const AppServiceBanner = () => {
  const [heroBanners, setHeroBanners] = useState([
    { bannerName: "hero-banner1", file: null, preview: null },
    { bannerName: "hero-banner2", file: null, preview: null },
    { bannerName: "hero-banner3", file: null, preview: null },
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

  /* ---------------- open modal ---------------- */
  const openUpdateModal = (file, type) => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setModalData({
      img: file,
      type,
      page: "service-banners",
      section: "app-servicepage",
    });

    setIsModalOpen(true);
  };

  /* ---------------- fetch banners ---------------- */
  const getBannersFromServer = async () => {
    try {
      const heroRes = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            page: "service-banners",
            section: "app-servicepage",
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
          <H4 className="mb-4 text-lg font-semibold">
            Service Page Hero Banners
          </H4>

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

export default AppServiceBanner;
