import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FeedbackMessageProps {
  type: "error" | "success";
  message: string;
}

export const FeedbackMessage = ({ type, message }: FeedbackMessageProps) => (
  <div
    className={`feedback feedback--${type}`}
    role={type === "error" ? "alert" : "status"}
  >
    {type === "success" ? (
      <CheckCircle2 size={18} />
    ) : (
      <AlertCircle size={18} />
    )}
    <span>{message}</span>
  </div>
);
