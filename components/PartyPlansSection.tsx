import { PartyPlan } from "./PartyPlan";
import { partyPlans, partyPlanFooterText } from "@/data/party-plans";

export const PartyPlansSection = () => (
  <section id="plans" aria-labelledby="plans-heading">
    <div className="mx-auto max-w-content px-6 pt-16 md:pt-24">
      <h2
        id="plans-heading"
        className="text-center text-3xl font-semibold tracking-wide text-brand md:text-4xl"
      >
        派對方案
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center leading-loose text-brand-ink/80">
        三種佈置風格自由挑選，從簡約清新到豪華背板，給寶寶最美的人生第一場派對。
      </p>
    </div>

    {partyPlans.map((plan, i) => (
      <PartyPlan
        key={plan.key}
        title={plan.title}
        features={plan.features}
        images={plan.images}
        reverse={i % 2 === 1}
        autoplayDelay={3800 + i * 200}
      />
    ))}

    <div className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
      <div className="rounded-3xl border border-brand-soft/60 bg-brand-soft/15 p-8 text-brand-ink shadow-sm md:p-10">
        <p className="font-medium text-brand">{partyPlanFooterText.intro}</p>
        <ul className="mt-4 space-y-2">
          {partyPlanFooterText.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-brand-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3 border-t border-brand-soft/50 pt-6 text-sm leading-relaxed">
          {partyPlanFooterText.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  </section>
);
