import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/products/ProductGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getPublishedProduct,
  getPublishedProducts,
} from "@/lib/products/server";
import { formatPrice, kindLabel, lineInquiryUrl } from "@/lib/products/shared";
import { productsDetail } from "@/lib/site-content/blocks/products";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ id: string }>;
}

const parseId = async (params: Props["params"]) => {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// 已上架的商品在 build 時先產生靜態頁；之後新上架的會在第一次瀏覽時產生
export async function generateStaticParams() {
  const items = await getPublishedProducts();
  return items.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = await parseId(params);
  const product = id ? await getPublishedProduct(id) : undefined;
  if (!product) return {};
  const biz = await getContent(siteBusiness);
  return buildPageMetadata(
    {
      title: `${product.name} - ${biz.brand}`,
      description:
        product.summary ||
        product.description.slice(0, 80) ||
        `${product.name}｜${biz.brand}商品專區`,
      image: product.images[0],
    },
    `/products/${product.id}`,
    biz.brand,
  );
}

export default async function ProductPage({ params }: Props) {
  const id = await parseId(params);
  const product = id ? await getPublishedProduct(id) : undefined;
  if (!product) notFound();

  const [c, biz, all] = await Promise.all([
    getContent(productsDetail),
    getContent(siteBusiness),
    getPublishedProducts(),
  ]);
  const others = all.filter((p) => p.id !== product.id).slice(0, 3);
  const inquiryHref = lineInquiryUrl(
    biz.lineId,
    c.inquiryMessage.replaceAll("{商品}", product.name),
  );

  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.description,
    image: product.images.map((src) => absoluteUrl(src)),
    url: absoluteUrl(`/products/${product.id}`),
    brand: { "@type": "Brand", name: biz.brand },
  };
  if (product.price !== null) {
    productJsonLd.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TWD",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.id}`),
      seller: { "@id": absoluteUrl("/#business") },
    };
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      <SiteHeader />
      <main className="flex-1 bg-brand-beige/40">
        <div className="mx-auto max-w-content px-6 py-12 md:py-16">
          <Link
            href="/products"
            className="text-sm text-brand-ink/70 hover:text-brand"
          >
            {c.backLink}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery images={product.images} name={product.name} />

            <div>
              <span className="inline-block rounded-full bg-white px-3 py-1 text-xs text-brand-ink/70">
                {kindLabel(product.kind)}
              </span>
              <h1 className="mt-3 text-2xl font-semibold leading-snug text-brand md:text-3xl">
                {product.name}
              </h1>
              <p className="mt-3 text-2xl font-semibold tracking-wide text-brand-accent">
                {formatPrice(product.price, product.priceNote)}
              </p>
              {product.summary && (
                <p className="mt-5 leading-relaxed text-brand-ink/85">
                  {product.summary}
                </p>
              )}

              <a
                href={inquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#06c755] px-8 py-3 font-medium text-white shadow-lg shadow-[#06c755]/30 transition-transform duration-300 hover:scale-105"
              >
                {c.inquiryButton}
              </a>
              {c.inquiryNote && (
                <p className="mt-3 whitespace-pre-line text-sm text-brand-ink/60">
                  {c.inquiryNote}
                </p>
              )}

              {product.description && (
                <div className="mt-10 whitespace-pre-line rounded-3xl bg-white p-6 leading-loose text-brand-ink/85 shadow-[0_18px_40px_rgba(237,160,157,0.10)]">
                  {product.description}
                </div>
              )}
            </div>
          </div>

          {others.length > 0 && (
            <section className="mt-20">
              <h2 className="text-xl font-semibold text-brand">
                {c.moreTitle}
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-3">
                {others.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      className="group block overflow-hidden rounded-2xl bg-white shadow-sm"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-brand-ink group-hover:text-brand">
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm text-brand-accent">
                          {formatPrice(p.price, p.priceNote)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
