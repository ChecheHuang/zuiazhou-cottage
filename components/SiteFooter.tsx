import Image from "next/image";
import Link from "next/link";
import { businessInfo } from "@/data/home";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: businessInfo.socials.instagram,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: businessInfo.socials.facebook,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden
      >
        <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.93.26-1.55 1.6-1.55h1.7V4.3a23 23 0 0 0-2.5-.13c-2.5 0-4.2 1.53-4.2 4.34v2.42H7.4V14h2.7v8h3.4z" />
      </svg>
    ),
  },
  {
    label: "Line",
    href: businessInfo.socials.line,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden
      >
        <path d="M12 3C6.48 3 2 6.6 2 11.05c0 4 3.55 7.34 8.36 7.97.32.07.76.22.87.5.1.26.07.66.03.92l-.14.85c-.04.25-.2.97.85.53 1.05-.44 5.66-3.34 7.72-5.71C20.99 14.86 22 13.06 22 11.05 22 6.6 17.52 3 12 3zM8.5 13.5H7v-3.78c0-.13.1-.22.22-.22h.22c.12 0 .22.1.22.22v2.78H9.5v1zM10 13.5h-.5v-4h.5v4zm5-2.78L13.4 13a.22.22 0 0 1-.4-.13V9.5h.5v2.5l1.5-2.32a.22.22 0 0 1 .4.12V13.5h-.4v-2.78zm-2.78 1.5h-1.5V12.5H12V12h-.78v-.5H12V11h-1.28v-.5h1.78v3z" />
      </svg>
    ),
  },
];

export const SiteFooter = () => (
  <footer
    id="contact"
    className="relative bg-white pt-16 pb-10"
  >
    <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-6 text-center">
      <Link
        href="/"
        className="flex items-center gap-3"
        aria-label="Happy 抓週小屋"
      >
        <Image
          src="/photos/logo.png"
          alt=""
          width={56}
          height={56}
          className="size-14"
        />
        <span className="text-lg font-semibold text-brand">
          Happy 抓週小屋
        </span>
      </Link>

      <p className="max-w-xl leading-loose text-brand-ink/80">
        抓週派對 / 生日派對 / 性別揭曉派對｜桃園楊梅包場
        <br />
        從場佈、流程、主持到攝影，一站式為寶貝留下最美的紀念。
      </p>
      <p className="text-sm text-brand-ink/70">
        {businessInfo.phone} · {businessInfo.address}
      </p>

      <ul className="flex items-center gap-4" aria-label="社群連結">
        {SOCIAL_LINKS.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="grid size-11 place-items-center rounded-full border border-brand-soft/60 text-brand transition-all duration-300 hover:scale-90 hover:bg-brand hover:text-white"
            >
              {s.icon}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4 w-full border-t border-brand-soft/40 pt-6 text-xs text-brand-ink/60">
        © {new Date().getFullYear()} Happy 抓週小屋. Made with warmth in
        桃園楊梅.
      </div>
    </div>
  </footer>
);
