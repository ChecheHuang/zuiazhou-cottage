import type { Metadata } from "next";
import Link from "next/link";
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
  partyPlayEntry,
  partySeo,
  partyTraditionalItems,
} from "@/lib/site-content/blocks/baby-party";
import { getContent } from "@/lib/site-content/server";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent(partySeo);
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(seo, "/baby-party", biz.brand);
}

export default async function BabyPartyPage() {
  const [career, traditional, playEntry] = await Promise.all([
    getContent(partyCareerItems),
    getContent(partyTraditionalItems),
    getContent(partyPlayEntry),
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
          <div className="mx-auto -mt-4 mb-16 flex max-w-content flex-col items-center gap-3 px-6 text-center md:mb-20">
            <p className="text-brand-ink/80">{playEntry.text}</p>
            <Link
              href="/play"
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 font-medium tracking-wider text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105"
            >
              {playEntry.button}
            </Link>
          </div>
        </section>
        <PhotoGallery />
        <BackgroundSlideshow />
        <BirthdayPlan />
      </main>
      <SiteFooter />
    </>
  );
}
