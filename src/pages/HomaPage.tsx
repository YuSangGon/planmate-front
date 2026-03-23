import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/home/HeroSection";
import TrustBar from "../components/home/TrustBar";
import BenefitsSection from "../components/home/BenefitsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import FeaturedPlansSection from "../components/home/FeaturedPlansSection";
import TopPlannersSection from "../components/home/TopPlannersSection";
import PromoBannerSection from "../components/home/PromoBannerSection";
import CTASection from "../components/home/CTASection";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <TrustBar />
      <BenefitsSection />
      <HowItWorksSection />
      <FeaturedPlansSection />
      <TopPlannersSection />
      <PromoBannerSection />
      <CTASection />
    </MainLayout>
  );
}
