import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

interface TodoPageProps {
  watermark: string;
  title: string;
  description?: string;
  comingSoon?: string[];
}

export const TodoPage = ({
  watermark,
  title,
  description,
  comingSoon,
}: TodoPageProps) => (
  <section className="bg-brand-beige/55 py-32 md:py-40">
    <div className="mx-auto max-w-content px-6">
      <SectionHeading
        watermark={watermark}
        title={title}
        description={description}
      />

      <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-dashed border-brand-soft bg-white/80 p-10 text-center shadow-[0_18px_40px_rgba(237,160,157,0.10)] backdrop-blur md:p-14">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-accent">
          Coming Soon
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-brand md:text-3xl">
          這個頁面正在準備中
        </h3>
        <p className="mt-4 leading-loose text-brand-ink/80">
          完整內容即將上線，先把路由與導航結構搭好，後續會逐步補上實際內容與素材。
        </p>

        {comingSoon && comingSoon.length > 0 && (
          <ul className="mx-auto mt-8 inline-flex flex-col gap-3 text-left text-sm text-brand-ink">
            {comingSoon.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand px-7 py-3 text-sm font-medium text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:scale-105 hover:bg-brand/90"
          >
            回到首頁
          </Link>
          <Link
            href="/baby-party"
            className="rounded-full border border-brand-soft/60 bg-white px-7 py-3 text-sm font-medium text-brand transition-all duration-300 hover:scale-105 hover:bg-brand-soft/30"
          >
            查看派對方案
          </Link>
        </div>
      </div>
    </div>
  </section>
);
