import HeroSection from "../components/home/HeroSection";
import StepsSection from "../components/home/StepsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import ServiceCards from "../components/home/ServiceCards";
import CTABanner from "../components/home/CTABanner";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StepsSection />
      <TestimonialsSection />
      <ServiceCards />
      <CTABanner />
    </div>
  );
}