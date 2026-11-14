import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ZhuazhouGame } from "@/components/play/ZhuazhouGame";
import {
  cleanBabyName,
  fillTemplate,
  findPlayItem,
  pickMatItems,
  resultPath,
} from "@/lib/play/items";
import { getPlayItems } from "@/lib/play/server";
import { buildPageMetadata } from "@/lib/seo";
import { playGame, playSeo } from "@/lib/site-content/blocks/play";
import { siteBusiness } from "@/lib/site-content/blocks/site";
import { getContent } from "@/lib/site-content/server";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 分享連結 /play?item=算盤&name=小湯圓 → 標題與預覽圖換成這次的結果
const readResult = async (searchParams: Props["searchParams"]) => {
  const params = await searchParams;
  const items = await getPlayItems();
  const item = findPlayItem(items, params.item);
  return { items, item, babyName: cleanBabyName(params.name) };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const [seo, game, biz, { item, babyName }] = await Promise.all([
    getContent(playSeo),
    getContent(playGame),
    getContent(siteBusiness),
    readResult(searchParams),
  ]);
  const base = buildPageMetadata(seo, "/play", biz.brand);
  if (!item) return base;

  // 結果頁不另外被搜尋引擎收錄，canonical 仍指向 /play
  const title = `${fillTemplate(game.resultTitle, {
    name: babyName || game.defaultName,
    item: `${item.name}${item.emoji}`,
  })} | ${biz.brand}`;
  const description = [item.meaning, game.blessing].filter(Boolean).join("｜");
  const image = {
    url: `/play/og?item=${encodeURIComponent(item.name)}`,
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    ...base,
    title,
    description,
    robots: { index: false, follow: true },
    // og:url 要是這次結果的網址，否則 Facebook 會改抓 /play 的預覽圖
    openGraph: {
      ...base.openGraph,
      url: resultPath(item.name, babyName),
      title,
      description,
      images: [image],
    },
    twitter: { ...base.twitter, title, description, images: [image.url] },
  };
}

export default async function PlayPage({ searchParams }: Props) {
  const [game, biz, { items, item, babyName }] = await Promise.all([
    getContent(playGame),
    getContent(siteBusiness),
    readResult(searchParams),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 md:py-24">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-brand-soft/30 blur-3xl md:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-10 hidden size-56 rounded-full bg-brand-accent/20 blur-3xl md:block"
          />
          <div className="relative mx-auto max-w-content px-4 sm:px-6">
            <SectionHeading
              as="h1"
              watermark={game.watermark}
              title={game.title}
              description={game.description}
            />
            <ZhuazhouGame
              items={items}
              initialMat={pickMatItems(items)}
              shared={item ? { item, babyName } : null}
              lineUrl={biz.lineUrl}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
