import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const Category = ({ category }) => {
  const { name, imageUrl,_id } = category;
  const navigate = useNavigate();

  const handleNavigate = ()=>{
    navigate(`categories/${_id}/services`)
  }

  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition pt-0">
      {/* Image */}
      <div onClick={handleNavigate} className="relative cursor-pointer w-full h-40 bg-gray-100">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <CardContent className="p-4 pt-0">
        {/* Name */}
        <h3 onClick={handleNavigate} className="text-sm cursor-pointer hover:underline hover:text-blue-700 font-semibold line-clamp-1">{name}</h3>
      </CardContent>
    </Card>
  );
};
