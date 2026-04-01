import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import ChatButton from "../components/chat/ChatButton";
import ChatPanel from "../components/chat/ChatPanel";

type MainLayoutProps = {
  children: ReactNode;
};

type NotificationToast = {
  id: string;
  title: string;
  message: string;
} | null;

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoggedIn, token } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notificationToast, setNotificationToast] =
    useState<NotificationToast>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(token);

    const handleNotification = (payload: {
      type: string;
      title: string;
      message: string;
      requestId?: string;
      proposalId?: string;
      createdAt: string;
    }) => {
      console.log("handle notification call");
      setNotificationToast({
        id: `${payload.type}-${payload.createdAt}`,
        title: payload.title,
        message: payload.message,
      });

      window.setTimeout(() => {
        setNotificationToast((prev) =>
          prev?.id === `${payload.type}-${payload.createdAt}` ? null : prev,
        );
      }, 2600);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, [isLoggedIn, token]);

  return (
    <div className="layout">
      <Header />
      <main className="main">{children}</main>
      <Footer />

      {isLoggedIn ? (
        <>
          {!isChatOpen && (
            <ChatButton onClick={() => setIsChatOpen(true)} unreadCount={1} />
          )}

          <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      ) : null}

      {notificationToast ? (
        <div className="global-notification-toast">
          <strong>{notificationToast.title}</strong>
          <p>{notificationToast.message}</p>
        </div>
      ) : null}
    </div>
  );
}
