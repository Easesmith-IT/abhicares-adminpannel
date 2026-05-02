import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ProductCard = ({
  item,
  onAdd,
  onIncrease,
  onDecrease,
  quantity = 0,
}) => {
  const { name, imageUrl, price } = item;

  return (
    <Card className="overflow-hidden pt-0 rounded-2xl shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="w-full h-40 bg-gray-100">
        <img
          src={imageUrl || "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <h3 className="text-sm font-semibold line-clamp-1">{name}</h3>

        <p className="text-base font-semibold">₹{price}</p>

        {/* Actions */}
        {quantity > 0 ? (
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onDecrease(item)}
            >
              -
            </Button>

            <span className="text-sm">{quantity}</span>

            <Button
              size="icon"
              variant="outline"
              onClick={() => onIncrease(item)}
            >
              +
            </Button>
          </div>
        ) : (
          <Button variant="abhicares" onClick={() => onAdd(item)} className="w-full">
            Add
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
