import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutPhotoStrip } from "@/components/about/AboutPhotoStrip";
import { AboutTeams } from "@/components/about/AboutTeams";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  aboutEnvironment,
  aboutPhotos,
  aboutSeo,
} from "@/lib/site-content/blocks/about";
import { getContent } from "@/lib/site-content/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const seo = await getContent(aboutSeo);
  return { title: seo.title, description: seo.description };
};

export default async function AboutPage() {
  const [photos, environment] = await Promise.all([
    getContent(aboutPhotos),
    getContent(aboutEnvironment),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <AboutHero />
        <AboutTeams />
        <AboutPhotoStrip
          watermark={photos.watermark}
          title={photos.title}
          description={photos.description}
          slot="about.photos"
        />
        <AboutPhotoStrip
          watermark={environment.watermark}
          title={environment.title}
          description={environment.description}
          slot="about.environment"
          bg="beige"
        />
      </main>
      <SiteFooter />
    </>
  );
}
