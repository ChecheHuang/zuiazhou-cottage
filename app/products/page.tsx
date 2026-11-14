import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPublishedProducts } from "@/lib/products/server";
import { formatPrice, kindLabel } from "@/lib/products/shared";
import { productsIntro, productsSeo } from "@/lib/site-content/blocks/products";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, biz] = await Promise.all([
    getContent(productsSeo),
    getContent(siteBusiness),
  ]);
  return buildPageMetadata(seo, "/products", biz.brand);
}

export default async function ProductsPage() {
  const [intro, items] = await Promise.all([
    getContent(productsIntro),
    getPublishedProducts(),
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
              as="h1"
              watermark={intro.watermark}
              title={intro.title}
              description={intro.description}
            />

            {items.length === 0 ? (
              <p className="mx-auto mt-14 max-w-md rounded-3xl bg-white px-8 py-12 text-center text-brand-ink/70 shadow-[0_18px_40px_rgba(237,160,157,0.10)]">
                {intro.empty}
              </p>
            ) : (
              <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      className="group block h-full overflow-hidden rounded-3xl border border-brand-soft/40 bg-white shadow-[0_18px_40px_rgba(237,160,157,0.10)] transition-shadow duration-300 hover:shadow-[0_22px_48px_rgba(237,160,157,0.22)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          priority={i < 3}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs text-brand-ink/80">
                          {kindLabel(p.kind)}
                        </span>
                      </div>
                      <div className="p-5">
                        <h2 className="text-lg font-semibold text-brand-ink transition-colors group-hover:text-brand">
                          {p.name}
                        </h2>
                        <p className="mt-1 font-medium text-brand-accent">
                          {formatPrice(p.price, p.priceNote)}
                        </p>
                        {p.summary && (
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-ink/75">
                            {p.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
