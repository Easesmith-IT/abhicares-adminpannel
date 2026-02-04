import { X } from "lucide-react";
import parse from "html-react-parser";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ServiceDetailsModal = ({ setIsModalOpen, service }) => {
  return (
    <Dialog open onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>

        {/* Service Info */}
        <div className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Service Image */}
            <img
              src={`${import.meta.env.VITE_APP_IMAGE_URL}/${service?.imageUrl}`}
              alt="service"
              className="w-48 h-48 object-cover rounded-md"
            />

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">{service?.name}</h4>
              <p className="text-sm text-muted-foreground">
                Starting Price: ₹{service?.startingPrice}
              </p>
              <div className="text-sm text-foreground">
                {service?.description && parse(service.description)}
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h5 className="text-base font-semibold mb-4">Features</h5>

            {service?.features?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex gap-4 border rounded-lg p-4">
                    {/* Feature Image */}
                    <img
                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/${feature?.image}`}
                      alt="feature"
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    {/* Feature Content */}
                    <div className="space-y-1">
                      <h6 className="font-medium">{feature?.title}</h6>
                      <p className="text-sm text-muted-foreground">
                        {feature?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No features found</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
