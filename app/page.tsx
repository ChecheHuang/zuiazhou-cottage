import { AboutSection } from "@/components/home/AboutSection";
import { BlogSection } from "@/components/home/BlogSection";
import { BookingSteps } from "@/components/home/BookingSteps";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { HomeGallery } from "@/components/home/HomeGallery";
import { InformationSection } from "@/components/home/InformationSection";
import { ParallaxBreak } from "@/components/home/ParallaxBreak";
import { ReviewSection } from "@/components/home/ReviewSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSlideshow />
        <AboutSection />
        <ServiceSection />
        <ParallaxBreak />
        <ReviewSection />
        <HomeGallery />
        <BookingSteps />
        <InformationSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </>
  );
}
