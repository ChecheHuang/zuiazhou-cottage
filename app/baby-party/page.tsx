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
import { careerItems, traditionalItems } from "@/data/zhuazhou-items";

export const metadata = {
  title: "寶寶派對 - Happy 抓週小屋",
  description:
    "桃園楊梅包場寶寶抓週派對、兒童生日派對、性別揭曉派對推薦，從場佈、流程到攝影一站式包辦。",
};

export default function BabyPartyPage() {
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
            eyebrow="Career Items"
            title="抓周職業物品"
            description="共 21 種職業道具，象徵寶寶未來無限可能。"
            items={careerItems}
            density="wide"
          />
          <ZhuazhouGrid
            eyebrow="Traditional Items"
            title="抓周傳統物品"
            description="承載家族祝福的傳統祈福物品。"
            items={traditionalItems}
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
