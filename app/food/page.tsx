import type { Metadata } from "next";
import { FoodHero } from "@/components/food/FoodHero";
import { FoodPlansSection } from "@/components/food/FoodPlansSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { foodSeo } from "@/lib/site-content/blocks/food";
import { getContent } from "@/lib/site-content/server";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { buildPageMetadata } from "@/lib/seo";

export const generateMetadata = async (): Promise<Metadata> => {
  const seo = await getContent(foodSeo);
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(seo, "/food", biz.brand);
};

export default function FoodPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <FoodHero />
        <FoodPlansSection />
      </main>
      <SiteFooter />
    </>
  );
}
