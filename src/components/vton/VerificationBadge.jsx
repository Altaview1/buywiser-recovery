import { CheckCircle } from "lucide-react";

export default function VerificationBadge({ size = "sm" }) {
  const sizeConfig = {
    sm: { badge: "px-2 py-1 text-xs", icon: "h-3 w-3" },
    md: { badge: "px-3 py-1.5 text-sm", icon: "h-4 w-4" },
    lg: { badge: "px-4 py-2 text-base", icon: "h-5 w-5" },
  };

  const config = sizeConfig[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border bg-green-50 text-green-700 border-green-200 ${config.badge}`}>
      <CheckCircle className={config.icon} />
      VTON Verified
    </span>
  );
}