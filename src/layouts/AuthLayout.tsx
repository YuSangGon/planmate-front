import type { ReactNode } from "react";
import MainLayout from "./MainLayout";
import AuthIntroPanel from "../components/auth/AuthIntroPanel";

type AuthBenefit = {
  title: string;
  description: string;
};

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: AuthBenefit[];
  children: ReactNode;
};

export default function AuthLayout({
  eyebrow,
  title,
  description,
  benefits,
  children,
}: AuthLayoutProps) {
  return (
    <MainLayout>
      <section className="auth-page">
        <div className="auth-shell">
          <AuthIntroPanel
            eyebrow={eyebrow}
            title={title}
            description={description}
            benefits={benefits}
          />

          <div className="auth-panel auth-panel--form">{children}</div>
        </div>
      </section>
    </MainLayout>
  );
}
