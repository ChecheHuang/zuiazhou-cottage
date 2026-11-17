import type { Metadata } from "next";
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
import { parseOutfit } from "@/lib/play/outfits";
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
  return {
    items,
    item,
    babyName: cleanBabyName(params.name),
    outfit: parseOutfit(params.outfit),
  };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const [seo, game, biz, { item, babyName, outfit }] = await Promise.all([
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
      url: resultPath(item.name, babyName, outfit),
      title,
      description,
      images: [image],
    },
    twitter: { ...base.twitter, title, description, images: [image.url] },
  };
}

export default async function PlayPage({ searchParams }: Props) {
  const [game, biz, { items, item, babyName, outfit }] = await Promise.all([
    getContent(playGame),
    getContent(siteBusiness),
    readResult(searchParams),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden pb-16 pt-8 md:pb-24 md:pt-12">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 top-10 hidden size-48 rounded-full bg-brand-soft/30 blur-3xl md:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 bottom-10 hidden size-56 rounded-full bg-brand-accent/20 blur-3xl md:block"
          />
          <div className="relative mx-auto max-w-content px-4 sm:px-6">
            {/* 精簡標題：浮水印疊在標題後面，不另外佔高度，遊戲畫面才能早點出現 */}
            <div className="relative text-center">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-3 font-display text-[56px] italic leading-none tracking-tight text-brand-cream md:-top-6 md:text-[88px]"
              >
                {game.watermark}
              </span>
              <h1 className="relative text-3xl font-semibold tracking-wide text-brand md:text-4xl">
                {game.title}
              </h1>
              {game.description && (
                <p className="relative mx-auto mt-3 max-w-2xl leading-relaxed text-brand-ink/80">
                  {game.description}
                </p>
              )}
            </div>
            <ZhuazhouGame
              items={items}
              initialMat={pickMatItems(items)}
              shared={item ? { item, babyName, outfit } : null}
              lineUrl={biz.lineUrl}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
