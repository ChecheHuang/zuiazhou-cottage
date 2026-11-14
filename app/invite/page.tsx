import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { InviteGenerator } from "@/components/invite/InviteGenerator";
import { buildPageMetadata } from "@/lib/seo";
import { inviteForm, inviteSeo } from "@/lib/site-content/blocks/invite";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, biz] = await Promise.all([
    getContent(inviteSeo),
    getContent(siteBusiness),
  ]);
  return buildPageMetadata(seo, "/invite", biz.brand);
}

export default async function InvitePage() {
  const c = await getContent(inviteForm);
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
          <div className="relative mx-auto max-w-content text-center">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-3 font-display text-[56px] italic leading-none tracking-tight text-brand-cream md:-top-6 md:text-[88px]"
            >
              {c.watermark}
            </span>
            <h1 className="relative text-3xl font-semibold tracking-wide text-brand md:text-4xl">
              {c.title}
            </h1>
            {c.description && (
              <p className="relative mx-auto mt-3 max-w-2xl leading-relaxed text-brand-ink/80">
                {c.description}
              </p>
            )}
          </div>
          <InviteGenerator />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
