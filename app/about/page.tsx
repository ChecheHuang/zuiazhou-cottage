import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutPhotoStrip } from "@/components/about/AboutPhotoStrip";
import { AboutTeams } from "@/components/about/AboutTeams";
import { PageCta } from "@/components/PageCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  aboutCta,
  aboutEnvironment,
  aboutPhotos,
  aboutSeo,
} from "@/lib/site-content/blocks/about";
import { getContent } from "@/lib/site-content/server";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { buildPageMetadata } from "@/lib/seo";

export const generateMetadata = async (): Promise<Metadata> => {
  const seo = await getContent(aboutSeo);
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(seo, "/about", biz.brand);
};

export default async function AboutPage() {
  const [photos, environment, cta] = await Promise.all([
    getContent(aboutPhotos),
    getContent(aboutEnvironment),
    getContent(aboutCta),
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
        <PageCta
          title={cta.title}
          text={cta.text}
          primaryLabel={cta.plansButton}
          primaryHref="/baby-party#plans"
          lineLabel={cta.lineButton}
        />
      </main>
      <SiteFooter />
    </>
  );
}
