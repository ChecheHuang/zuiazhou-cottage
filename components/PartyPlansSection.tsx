import Link from "next/link";
import { PartyPlan } from "./PartyPlan";
import { partyPlans } from "@/lib/site-content/blocks/baby-party";
import { getContent } from "@/lib/site-content/server";

export const PartyPlansSection = async () => {
  const c = await getContent(partyPlans);
  return (
    <section id="plans" aria-labelledby="plans-heading">
      <div className="mx-auto max-w-content px-6 pt-16 md:pt-24">
        <h2
          id="plans-heading"
          className="text-center text-3xl font-semibold tracking-wide text-brand md:text-4xl"
        >
          {c.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-center leading-loose text-brand-ink/80">
          {c.intro}
        </p>
      </div>

      {c.plans.map((plan, i) => (
        <PartyPlan
          key={`${i}-${plan.title}`}
          title={plan.title}
          price={plan.price}
          features={plan.features}
          images={plan.images}
          reverse={i % 2 === 1}
          autoplayDelay={3800 + i * 200}
        />
      ))}

      <div className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
        <div className="rounded-3xl border border-brand-soft/60 bg-brand-soft/15 p-8 text-brand-ink shadow-sm md:p-10">
          <p className="font-medium text-brand">{c.includesTitle}</p>
          <ul className="mt-4 space-y-2">
            {c.includes.map((b, i) => (
              <li key={`${i}-${b}`} className="flex items-start gap-2">
                <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-3 border-t border-brand-soft/50 pt-6 text-sm leading-relaxed">
            {c.notes.map((n, i) => (
              <p key={`${i}-${n}`} className="whitespace-pre-line">
                {n}
              </p>
            ))}
          </div>
          {/* 看完方案的下一步：加購細節與總預算 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "/photo", label: c.photoLink },
              { href: "/food", label: c.foodLink },
              { href: "/budget", label: c.budgetLink },
            ]
              .filter((l) => l.label.trim())
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand ring-1 ring-brand-soft/70 transition-colors hover:bg-brand-soft/30"
                >
                  {l.label} →
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
