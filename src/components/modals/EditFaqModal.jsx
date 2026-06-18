import { useEffect, useState } from "react";
import { toast } from "sonner";

import usePatchApiReq from "../../hooks/usePatchApiReq";
import usePostApiReq from "../../hooks/usePostApiReq";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EditFaqModal = ({ setIsModalOpen, faq = null, getAllFaqs }) => {
  const {
    res: createFaqRes,
    fetchData: createFaq,
    isLoading: createFaqLoading,
  } = usePostApiReq();

  const {
    res: updateFaqRes,
    fetchData: updateFaq,
    isLoading,
  } = usePatchApiReq();

  const [faqInfo, setFaqInfo] = useState({
    ques: faq?.ques || "",
    ans: faq?.ans || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaqInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!faqInfo.ques || !faqInfo.ans) {
      toast.error("Both question and answer are required");
      return;
    }

    if (faq) {
      updateFaq(`/admin/update-faq/${faq._id}`, faqInfo);
    } else {
      createFaq("/admin/create-faq", faqInfo);
    }
  };

  /* Create success */
  useEffect(() => {
    if (createFaqRes?.status === 200 || createFaqRes?.status === 201) {
      // toast.success("FAQ created successfully");
      getAllFaqs();
      setIsModalOpen(false);
    }
  }, [createFaqRes]);

  /* Update success */
  useEffect(() => {
    if (updateFaqRes?.status === 200 || updateFaqRes?.status === 201) {
      // toast.success("FAQ updated successfully");
      getAllFaqs();
      setIsModalOpen(false);
    }
  }, [updateFaqRes]);

  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{faq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question</label>
            <Input
              name="ques"
              value={faqInfo.ques}
              onChange={handleChange}
              placeholder="Enter FAQ question"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Answer</label>
            <Textarea
              name="ans"
              value={faqInfo.ans}
              onChange={handleChange}
              placeholder="Enter FAQ answer"
              className="resize-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="abhicares"
              type="submit"
              disabled={createFaqLoading || isLoading}
            >
              {createFaqLoading || isLoading
                ? "Saving..."
                : faq
                  ? "Update FAQ"
                  : "Add FAQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFaqModal;
