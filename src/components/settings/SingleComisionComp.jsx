import { useState } from "react";
import { Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateComisionModal from "../modals/UpdateComisionModal";
import { Button } from "../ui/button";

const SingleComisionComp = ({ item, getAllCategories }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <>
      <Card className="relative">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-lg">{item?.name}</CardTitle>

          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            size="icon"
            variant="outline"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Commission Rate:</span>{" "}
            {item?.commission}%
          </p>
          <p>
            <span className="font-medium">Convenience Amount:</span> ₹
            {item?.convenience}
          </p>
        </CardContent>
      </Card>

      {isUpdateModalOpen && (
        <UpdateComisionModal
          getAllComisions={() => {}}
          setIsModalOpen={setIsUpdateModalOpen}
          commission={item}
          getAllCategories={getAllCategories}
        />
      )}
    </>
  );
};

export default SingleComisionComp;
