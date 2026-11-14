import type { Metadata } from "next";
import { AddonGrid } from "@/components/photo/AddonGrid";
import { PhotoPortfolio } from "@/components/photo/PhotoPortfolio";
import { PhotographerPlan } from "@/components/photo/PhotographerPlan";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { photoSeo } from "@/lib/site-content/blocks/photo";
import { getContent } from "@/lib/site-content/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const seo = await getContent(photoSeo);
  return { title: seo.title, description: seo.description };
};

export default function PhotoPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PhotographerPlan />
        <PhotoPortfolio />
        <AddonGrid />
      </main>
      <SiteFooter />
    </>
  );
}
