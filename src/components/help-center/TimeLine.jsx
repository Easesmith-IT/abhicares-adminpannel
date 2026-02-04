import { Check, X } from "lucide-react";

const Timeline = ({ title, time, status, className, desc }) => {
  return (
    <div className="flex gap-3 relative">
      {/* Icon */}
      <div
        className={`flex items-center justify-center h-6 w-6 rounded-full text-white shrink-0 ${className}`}
      >
        {status ? <Check size={12} /> : <X size={12} />}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{title}</span>

        {time && <span className="text-xs text-muted-foreground">{time}</span>}

        {desc && <span className="text-xs text-muted-foreground">{desc}</span>}
      </div>
    </div>
  );
};

export default Timeline;
