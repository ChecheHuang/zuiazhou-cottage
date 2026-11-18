import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { AvailabilitySection } from "@/components/home/AvailabilitySection";
import { BlogSection } from "@/components/home/BlogSection";
import { BookingSteps } from "@/components/home/BookingSteps";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { HomeGallery } from "@/components/home/HomeGallery";
import { InformationSection } from "@/components/home/InformationSection";
import { ReviewSection } from "@/components/home/ReviewSection";
import { RoomsSection } from "@/components/home/RoomsSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { homeSeo } from "@/lib/site-content/blocks/home";
import { getContent } from "@/lib/site-content/server";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent(homeSeo);
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(seo, "/", biz.brand);
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSlideshow />
        {/* 爸媽最想先看價格與人數，主題場地緊接在大圖後面 */}
        <RoomsSection />
        <AboutSection />
        <ServiceSection />
        <ReviewSection />
        <HomeGallery />
        <BookingSteps />
        <AvailabilitySection />
        <InformationSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </>
  );
}
