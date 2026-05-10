import { AboutHero } from "@/components/about/AboutHero";
import { AboutPhotoStrip } from "@/components/about/AboutPhotoStrip";
import { AboutTeams } from "@/components/about/AboutTeams";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  aboutEnvironmentGallery,
  aboutPhotoGallery,
} from "@/data/about";

export const metadata = {
  title: "關於我們 - Happy 抓週小屋",
  description:
    "Happy 抓週小屋主理人團隊的故事、合作餐點夥伴與場地環境照片。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <AboutHero />
        <AboutTeams />
        <AboutPhotoStrip
          watermark="Photos"
          title="攝影作品"
          description="從佈置到寶寶笑容，每一刻都值得珍藏。"
          images={aboutPhotoGallery}
        />
        <AboutPhotoStrip
          watermark="Environment"
          title="環境照片"
          description="桃園楊梅 15 坪派對小屋，搭配溫柔色系的派對佈景。"
          images={aboutEnvironmentGallery}
          bg="beige"
        />
      </main>
      <SiteFooter />
    </>
  );
}
