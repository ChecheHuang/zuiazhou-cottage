import { FoodHero } from "@/components/food/FoodHero";
import { FoodPlansSection } from "@/components/food/FoodPlansSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "餐食加購 - Happy 抓週小屋",
  description:
    "Happy 抓週小屋專屬組合菜色、單點、合菜桌菜、下午茶點心，儀式結束後直接入座。",
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
