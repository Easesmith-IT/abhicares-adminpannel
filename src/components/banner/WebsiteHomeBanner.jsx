import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

import UpdateBannerModal from "../modals/UpdateBannerModal";
import { H4 } from "../shared/typography";
import useCrashReporter from "../../hooks/useCrashReporter";
import { readCookie } from "../../utils/readCookie";

const WebsiteHomeBanner = () => {
  const [banners, setBanners] = useState([
    { bannerName: "banner1", file: null, preview: null },
    { bannerName: "banner2", file: null, preview: null },
    { bannerName: "banner3", file: null, preview: null },
    { bannerName: "banner4", file: null, preview: null },
    { bannerName: "banner5", file: null, preview: null },
    { bannerName: "banner6", file: null, preview: null },
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

  /* ---------------- image handler ---------------- */
  const handleImageChange = (e, bannerName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBanners((prev) =>
        prev.map((b) =>
          b.bannerName === bannerName
            ? { ...b, file, preview: reader.result }
            : b,
        ),
      );
    };
    reader.readAsDataURL(file);
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
      page: "home-sale-banners",
      section: "web-homepage",
    });

    setIsModalOpen(true);
  };

  /* ---------------- fetch banners ---------------- */
  const getBannersFromServer = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            heroBanners: true,
            page: "home-sale-banners",
            section: "web-homepage",
          },
          withCredentials: true,
        },
      );

      setBanners((prev) =>
        prev.map((b, i) => ({
          ...b,
          preview: res.data?.banners?.[i]?.image
            ? `${import.meta.env.VITE_APP_IMAGE_URL}/${res.data.banners[i].image}`
            : null,
          file: null,
        })),
      );
    } catch (err) {
      console.error(err);
       reportCrash({
         error: err,
         screenName: "WebsiteHomeBanner",
         severity: "HIGH",
         request: {
           url: "/admin/login-Admin",
         },
         userId: adminInfo?.id,
         userType: "Admin",
       });
    }
  };

  useEffect(() => {
    getBannersFromServer();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          <H4>Website Home – Sale Banners</H4>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {banners.map((banner, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  {banner.preview && (
                    <img
                      src={banner.preview}
                      alt="banner"
                      className="h-40 w-full rounded-md object-cover border"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, banner.bannerName)}
                  />

                  <Button
                    variant="abhicares"
                    className="w-full"
                    onClick={() =>
                      openUpdateModal(banner.file, `banner${index + 1}`)
                    }
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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

export default WebsiteHomeBanner;
