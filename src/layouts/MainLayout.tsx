import type { ReactNode } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
