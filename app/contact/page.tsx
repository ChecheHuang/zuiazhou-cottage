import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getContent } from "@/lib/site-content/server";
import type { Metadata } from "next";
import {
  contactIntro,
  contactLocation,
  contactSeo,
  fillBusinessTokens,
} from "@/lib/site-content/blocks/contact";
import { mapEmbedUrlFor, siteBusiness } from "@/lib/site-content/blocks/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent(contactSeo);
  return { title: seo.title, description: seo.description };
}

export default async function ContactPage() {
  const [biz, intro, location] = await Promise.all([
    getContent(siteBusiness),
    getContent(contactIntro),
    getContent(contactLocation),
  ]);
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-beige/55 py-20 md:py-28">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-brand-soft/30 blur-3xl md:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-10 hidden size-56 rounded-full bg-brand-accent/20 blur-3xl md:block"
          />

          <div className="relative mx-auto max-w-content px-6">
            <SectionHeading
              watermark={intro.watermark}
              title={intro.title}
              description={intro.description}
            />
            <div className="mt-14">
              <ContactInfo />
            </div>
          </div>
        </section>

        <section className="bg-white/65 py-20 md:py-28">
          <div className="mx-auto grid max-w-content gap-12 px-6 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-accent">
                {location.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-brand md:text-3xl">
                {location.title}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-loose text-brand-ink/80">
                {fillBusinessTokens(location.body, biz)}
              </p>
              <div className="mt-8 overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(237,160,157,0.16)]">
                <iframe
                  title={`${biz.brand}位置地圖`}
                  src={mapEmbedUrlFor(biz.address)}
                  width="100%"
                  height={420}
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
