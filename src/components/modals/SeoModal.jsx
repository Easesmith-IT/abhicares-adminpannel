import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import usePatchApiReq from "../../hooks/usePatchApiReq";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SeoModal = ({ setIsModalOpen }) => {
  const [info, setInfo] = useState({
    title: "",
    page: "",
    desc: "",
  });

  const { res: seoRes, fetchData: seoFetchData, isLoading } = usePatchApiReq();

  const handleSelectChange = async (e) => {
    const { value } = e.target;
    try {
      setInfo((prev) => ({ ...prev, page: value }));

      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_CMS_URL}/get-seo-by-page?page=${value}`,
        { withCredentials: true },
      );

      setInfo((prev) => ({
        ...prev,
        title: data.seo.seoTitle,
        desc: data.seo.seoDescription,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!info.title || !info.desc) return;

    await seoFetchData(`/content/update-seo-by-page`, {
      page: info.page,
      seoDescription: info.desc,
      seoTitle: info.title,
    });
  };

  useEffect(() => {
    if (seoRes?.status === 200 || seoRes?.status === 201) {
      setIsModalOpen(false);
    }
  }, [seoRes]);

  return (
    <Dialog open onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Manage SEO</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleOnSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Page</Label>

              <Select
                value={info.page}
                onValueChange={(value) =>
                  handleSelectChange({ target: { value } })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="womens-salon-spa">
                    Women's Salon & Spa
                  </SelectItem>
                  <SelectItem value="makeup-mehandi">
                    Makeup & Mehandi
                  </SelectItem>
                  <SelectItem value="mens-salon-massage">
                    Men's Salon & Massage
                  </SelectItem>
                  <SelectItem value="home-care">Home Care</SelectItem>
                  <SelectItem value="home-repair">Home Repair</SelectItem>
                  <SelectItem value="appliance-repair">
                    Appliance Repair
                  </SelectItem>
                  <SelectItem value="home-page">Home Page</SelectItem>
                  <SelectItem value="about-us">About Us</SelectItem>
                  <SelectItem value="register-as-professional">
                    Register as Professional
                  </SelectItem>
                  <SelectItem value="blogs">Blogs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                value={info.title}
                onChange={handleOnChange}
                placeholder="Enter SEO title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="desc"
                rows={4}
                value={info.desc}
                onChange={handleOnChange}
                placeholder="Enter SEO description"
                className="resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="abhicares" type="submit">
                {isLoading ? "Updating" : "Update"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeoModal;
