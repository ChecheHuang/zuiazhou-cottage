import type { Metadata } from "next";
import Link from "next/link";
import { BudgetCalculator } from "@/components/budget/BudgetCalculator";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { budgetSeo, budgetText } from "@/lib/site-content/blocks/budget";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, biz] = await Promise.all([
    getContent(budgetSeo),
    getContent(siteBusiness),
  ]);
  return buildPageMetadata(seo, "/budget", biz.brand);
}

export default async function BudgetPage() {
  const c = await getContent(budgetText);
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-20 md:py-28">
        <div className="mx-auto max-w-content px-6">
          <SectionHeading
            as="h1"
            watermark={c.watermark}
            title={c.title}
            description={c.description}
          />
          <BudgetCalculator />
          {/* 算完想再確認細節：回到場地方案或加購頁 */}
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {c.plansLink && (
              <Link href="/baby-party#plans" className="text-brand underline-offset-4 hover:underline">
                {c.plansLink}
              </Link>
            )}
            {c.addonsLink && (
              <Link href="/photo" className="text-brand underline-offset-4 hover:underline">
                {c.addonsLink} →
              </Link>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
