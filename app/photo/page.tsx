import { AddonGrid } from "@/components/photo/AddonGrid";
import { PhotoPortfolio } from "@/components/photo/PhotoPortfolio";
import { PhotographerPlan } from "@/components/photo/PhotographerPlan";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "派對加購方案 - Happy 抓週小屋",
  description:
    "攝影師加購、空飄氣球、客製立牌、寶寶猜測版等加購方案，自由搭配為派對升級。",
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
