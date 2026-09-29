import { Gauge } from "lucide-react";

export const Brand = () => (
  <div className="brand" aria-label="Pista Lenta">
    <span className="brand__mark">
      <Gauge size={20} strokeWidth={1.8} />
    </span>
    <span>Pista Lenta</span>
  </div>
);
