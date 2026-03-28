import { createContext, useContext, useState, type ReactNode } from "react";
import Toast from "../components/common/Toast";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const showToast = (msg: string, t: ToastType = "info") => {
    setMessage(msg);
    setType(t);
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} type={type} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
