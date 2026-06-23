import { FaArrowRight, FaCheck, FaHeart, FaShieldHeart } from 'react-icons/fa6';
import type { HeroContent, SiteSettings } from '../content/types';

type HeroProps = {
  content: HeroContent;
  site: SiteSettings;
};

function Hero({ content, site }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden bg-care-gradient py-16 sm:py-20 lg:py-24">
      <div className="animate-drift absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-sage/20 blur-3xl" aria-hidden="true" />
      <div className="animate-soft-pulse absolute bottom-0 right-0 h-80 w-80 rounded-full bg-harbor/10 blur-3xl" aria-hidden="true" />

      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="animate-fade-up">
          <span className="eyebrow animate-fade-up" style={{ animationDelay: '80ms' }}>
            <FaShieldHeart aria-hidden="true" />
            {content.eyebrow}
          </span>
          <h1 className="animate-fade-up mt-6 max-w-4xl text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl lg:leading-[1.05]" style={{ animationDelay: '160ms' }}>
            {content.heading}
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-ink/72" style={{ animationDelay: '240ms' }}>
            {content.body}
          </p>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '320ms' }}>
            <a
              href={content.primaryCta.href}
              className="focus-ring button-glow inline-flex items-center justify-center gap-3 rounded-full bg-moss px-6 py-3.5 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
            >
              <span className="relative z-10">{content.primaryCta.label}</span>
              <FaArrowRight className="relative z-10 text-sm" aria-hidden="true" />
            </a>
            <a
              href={content.secondaryCta.href}
              className="focus-ring inline-flex items-center justify-center rounded-full border border-moss/20 bg-white/70 px-6 py-3.5 text-base font-bold text-moss shadow-sm transition hover:-translate-y-0.5 hover:border-moss/40 hover:bg-white"
            >
              {content.secondaryCta.label}
            </a>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {content.highlights.map((item, index) => (
              <div
                key={item}
                className="animate-fade-up flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-ink/75 shadow-sm backdrop-blur"
                style={{ animationDelay: `${420 + index * 90}ms` }}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage/20 text-moss">
                  <FaCheck className="text-xs" aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up relative" style={{ animationDelay: '260ms' }}>
          <div className="animate-float absolute -left-3 top-12 hidden rounded-3xl bg-white/80 p-4 shadow-lift backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-harbor">
                <FaHeart aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{content.floatingCard.title}</p>
                <p className="text-xs text-ink/60">{content.floatingCard.copy}</p>
              </div>
            </div>
          </div>

          <div className="card-sheen animate-float-slow rounded-[2rem] border border-white/70 bg-white/62 p-4 shadow-lift backdrop-blur">
            <div className="min-h-[440px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-mist via-white to-linen p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss/80">{content.snapshot.eyebrow}</p>
                  <h2 className="mt-3 text-2xl font-bold text-ink">{content.snapshot.heading}</h2>
                </div>
                <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-sage/40 bg-white shadow-soft">
                  <img
                    src={site.logo}
                    alt={site.logoAlt}
                    className="h-full w-full object-contain p-1"
                  />
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {content.snapshot.stats.map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} className="rounded-3xl bg-white/86 p-5 shadow-sm">
                    <p className="text-3xl font-bold text-harbor">{stat.value}</p>
                    <p className="mt-2 text-sm font-semibold text-ink/65">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-white/78 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-bold text-ink">{content.snapshot.rhythmTitle}</p>
                  <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-bold text-moss">{content.snapshot.rhythmBadge}</span>
                </div>
                <div className="space-y-4">
                  {content.snapshot.rhythmItems.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-mist text-sm font-bold text-harbor">
                        {index + 1}
                      </span>
                      <div className="h-3 flex-1 rounded-full bg-linen">
                        <div className="animate-grow-bar h-3 rounded-full bg-sage" style={{ width: `${68 + index * 10}%` }} />
                      </div>
                      <span className="w-28 text-right text-xs font-semibold text-ink/60">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {content.snapshot.values.map((item) => (
                  <div key={item} className="rounded-2xl bg-moss/8 px-3 py-4 text-center text-sm font-bold text-moss">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
