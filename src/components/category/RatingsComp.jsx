import ReactStars from "react-stars";
import { Star } from "lucide-react";

import RatingBar from "./RatingBar";

const RatingsComp = ({ item }) => {
  const { rating = 0, ratingDistribution = {}, totalReviews = 0 } = item || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Average */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>

        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold">{rating}</span>
          <ReactStars
            edit={false}
            size={26}
            count={5}
            value={rating}
            color2="#FF8A00"
          />
        </div>

        <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
      </div>

      {/* Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <RatingBar
            key={star}
            star={star}
            value={ratingDistribution[String(star)] || 0}
            max={totalReviews}
          />
        ))}
      </div>
    </div>
  );
};

export default RatingsComp;
