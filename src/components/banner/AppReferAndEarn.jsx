import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

import UpdateBannerModal from "../modals/UpdateBannerModal";
import { readCookie } from "../../utils/readCookie";
import useCrashReporter from "../../hooks/useCrashReporter";
import usePostApiReq from "../../hooks/usePostApiReq";
import { Spinner } from "../ui/spinner";

const AppReferAndEarn = () => {
  const { reportCrash } = useCrashReporter();

  const [banner, setBanner] = useState({
    file: null,
    preview: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    img: "",
    type: "",
    page: "",
    section: "",
  });

  const adminInfo = readCookie("adminInfo");

  /* ---------------- image handler ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBanner({
        file,
        preview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- open modal ---------------- */
  // const openUpdateModal = () => {
  //   console.log("banner", banner);

  //   if (!banner.file) {
  //     toast.error("Please select an image");
  //     return;
  //   }

  //   setModalData({
  //     img: banner.file,
  //     type: "refer-banner",
  //     page: "refer-banners",
  //     section: "app-refer-banner",
  //   });

  //   setIsModalOpen(true);
  // };

  /* ---------------- fetch banner ---------------- */
  const getBannersFromServer = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-banners`,
        {
          params: {
            type: "refer-banner",
            page: "refer",
            section: "app-refer-banner",
          },
          withCredentials: true,
        },
      );

      setBanner({
        file: null,
        preview: res.data?.banners?.image
          ? `${import.meta.env.VITE_APP_IMAGE_URL}/${res.data.banners.image}`
          : null,
      });
    } catch (err) {
      console.error(err);
      reportCrash({
        error: err,
        screenName: "AppReferAndEarn",
        severity: "HIGH",
        request: {
          url: "/content/get-banners",
        },
        userId: adminInfo.id,
        userType: "Admin",
      });
    }
  };

  useEffect(() => {
    getBannersFromServer();
  }, []);

  const { res, fetchData, isLoading } = usePostApiReq();
  const openUpdateModal = () => {
    if (!banner.file) {
      toast.error("Please select an image");
      return;
    }

     setModalData({
       img: banner.file,
       type: "refer-banner",
       page: "refer",
       section: "app-refer-banner",
     });

    const formData = new FormData();
    formData.append("img", banner.file);
    formData.append("type", "refer-banner");
    formData.append("page", "refer");
    formData.append("section", "app-refer-banner");

    // fetchData("/content/upload-banners", formData);
  };

  // useEffect(() => {
  //   if (res?.status === 200 || res?.status === 201) {
  //     // toast.success("Banner updated successfully");
  //     getBannersFromServer();
  //   }
  // }, [res]);

  return (
    <>
      <div className="m-6 max-w-xl space-y-6">
        <h2 className="text-lg font-semibold">Refer and Earn Banner</h2>

        <Card>
          <CardContent className="p-4 space-y-4">
            {banner.preview && (
              <img
                src={banner.preview}
                alt="Refer Banner"
                className="h-48 w-full rounded-md object-cover border"
              />
            )}

            <input type="file" accept="image/*" onChange={handleImageChange} />

            <Button
              variant="abhicares"
              className="w-full"
              onClick={openUpdateModal}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Update Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>
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

export default AppReferAndEarn;
