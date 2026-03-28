import { useEffect } from "react";
import "../../styles/Toast.css";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return <div className={`toast toast--${type}`}>{message}</div>;
}
