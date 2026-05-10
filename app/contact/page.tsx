import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "聯絡我們 - Happy 抓週小屋",
  description:
    "桃園楊梅 Happy 抓週小屋聯絡資訊、地圖與線上預約表單，歡迎留言或加 LINE 諮詢。",
};

export default function ContactPage() {
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
              watermark="Contact Us"
              title="聯絡我們"
              description="想預約抓週、收涎或生日派對？歡迎透過 LINE 或下方表單與我們聯絡。"
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
                Find us
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-brand md:text-3xl">
                位置與交通
              </h2>
              <p className="mt-4 leading-loose text-brand-ink/80">
                桃園楊梅交流道下車約 10 分鐘車程，鄰近楊梅火車站，現場提供 20 格免費停車位。
              </p>
              <div className="mt-8 overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(237,160,157,0.16)]">
                <iframe
                  title="Happy 抓週小屋位置地圖"
                  src="https://www.google.com/maps?q=%E6%A1%83%E5%9C%92%E5%B8%82%E6%A5%8A%E6%A2%85%E5%8D%80%E5%B9%BC%E7%8D%85%E8%B7%AF%E4%BA%8C%E6%AE%B5218%E5%B7%B7360%E5%BC%8439%E8%99%9F&hl=zh-TW&z=16&output=embed"
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
