import { Star } from "lucide-react";

const RatingBar = ({ star, value, max }) => {
  const percent = max ? Math.round((value / max) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-16 text-sm">
        <span>{star}</span>
        <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
      </div>

      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${percent}%` }}
        />
      </div>

      <span className="w-8 text-sm text-muted-foreground text-right">
        {value}
      </span>
    </div>
  );
};

export default RatingBar;
