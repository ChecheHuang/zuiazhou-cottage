import type { Metadata } from "next";
import { BackgroundSlideshow } from "@/components/BackgroundSlideshow";
import { BirthdayPlan } from "@/components/BirthdayPlan";
import { HeroIntro } from "@/components/HeroIntro";
import { HostIntro } from "@/components/HostIntro";
import { NoticeList } from "@/components/NoticeList";
import { PartyPlansSection } from "@/components/PartyPlansSection";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RitualTimeline } from "@/components/RitualTimeline";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ZhuazhouGrid } from "@/components/ZhuazhouGrid";
import {
  partyCareerItems,
  partySeo,
  partyTraditionalItems,
} from "@/lib/site-content/blocks/baby-party";
import { getContent } from "@/lib/site-content/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent(partySeo);
  return { title: seo.title, description: seo.description };
}

export default async function BabyPartyPage() {
  const [career, traditional] = await Promise.all([
    getContent(partyCareerItems),
    getContent(partyTraditionalItems),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroIntro />
        <PartyPlansSection />
        <NoticeList />
        <HostIntro />
        <RitualTimeline />
        <section id="items">
          <ZhuazhouGrid
            eyebrow={career.eyebrow}
            title={career.title}
            description={career.description}
            items={career.items}
            density="wide"
          />
          <ZhuazhouGrid
            eyebrow={traditional.eyebrow}
            title={traditional.title}
            description={traditional.description}
            items={traditional.items}
            density="compact"
          />
        </section>
        <PhotoGallery />
        <BackgroundSlideshow />
        <BirthdayPlan />
      </main>
      <SiteFooter />
    </>
  );
}
