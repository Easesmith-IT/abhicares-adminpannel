import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import usePostApiReq from "../../hooks/usePostApiReq";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2, Plus } from "lucide-react";
import AddFeatureModal from "./AddFeatureModal";
import DeleteModal from "./DeleteModal";

const FeaturesModal = ({
  setIsModalOpen,
  allFeatures = [],
  getServiceDetails,
  serviceId,
}) => {
  const { res, fetchData, isLoading } = usePostApiReq();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleDelete = () => {
    if (!selectedFeature?.title) return;

    fetchData(
      `/admin/delete-service-feature/${serviceId}?title=${selectedFeature.title}`,
    );
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      // toast.success(res?.data?.message || "Feature deleted");
      getServiceDetails();
      setIsDeleteOpen(false);
    }
  }, [res]);

  return (
    <>
      <Dialog open onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>Features</DialogTitle>
              <DialogDescription>
                Manage service features shown to users.
              </DialogDescription>
            </div>

            <Button variant="abhicares" onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </DialogHeader>

          {/* Content */}
          <div className="mt-4 space-y-4">
            {allFeatures.length === 0 && (
              <div className="flex h-[120px] items-center justify-center text-sm text-muted-foreground">
                No features found
              </div>
            )}

            {allFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    {feature?.image && (
                      <img
                        src={`${import.meta.env.VITE_APP_IMAGE_URL}/${feature.image}`}
                        alt={feature.title}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}

                    {/* Text */}
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setEditIndex(index);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Feature */}
      {isAddOpen && (
        <AddFeatureModal
          setIsModalOpen={setIsAddOpen}
          getServiceDetails={getServiceDetails}
          serviceId={serviceId}
        />
      )}

      {/* Update Feature */}
      {isEditOpen && (
        <AddFeatureModal
          setIsModalOpen={setIsEditOpen}
          feature={selectedFeature}
          index={editIndex}
          getServiceDetails={getServiceDetails}
          serviceId={serviceId}
        />
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <DeleteModal setState={setIsDeleteOpen} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default FeaturesModal;
