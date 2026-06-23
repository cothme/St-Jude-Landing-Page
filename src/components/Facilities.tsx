import { FaLeaf, FaMoon, FaSun } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { FacilitiesContent } from '../content/types';
import Reveal from './Reveal';

const facilityIcons: Record<FacilitiesContent['spaces'][number]['icon'], IconType> = {
  leaf: FaLeaf,
  moon: FaMoon,
  sun: FaSun,
};

const facilityGradients: Record<FacilitiesContent['spaces'][number]['gradient'], string> = {
  'harbor-mist': 'from-harbor/18 via-white to-mist',
  'moss-cream': 'from-moss/16 via-white to-cream',
  'sage-linen': 'from-sage/18 via-white to-linen',
};

type FacilitiesProps = {
  content: FacilitiesContent;
};

function Facilities({ content }: FacilitiesProps) {
  return (
    <section id="facilities" className="bg-linen/55 py-20 sm:py-24">
      <div className="section-shell">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="section-heading">{content.heading}</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-ink/68">{content.copy}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {content.spaces.map((space, index) => {
            const Icon = facilityIcons[space.icon];
            return (
              <Reveal key={space.title} delay={index * 120}>
                <article className="card-sheen group overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className={`h-64 bg-gradient-to-br ${facilityGradients[space.gradient]} p-5`}>
                    {space.image ? (
                      <div className="relative h-full overflow-hidden rounded-[1.35rem] border border-white/70 shadow-sm transition duration-300 group-hover:scale-[1.02]">
                        <img
                          src={space.image}
                          alt={space.imageAlt || space.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute left-5 top-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/82 text-2xl text-moss shadow-sm backdrop-blur transition duration-300 group-hover:scale-105">
                          <Icon aria-hidden="true" />
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-between rounded-[1.35rem] border border-white/70 bg-white/36 p-5 backdrop-blur-sm transition duration-300 group-hover:scale-[1.02]">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/82 text-2xl text-moss shadow-sm transition duration-300 group-hover:scale-105">
                          <Icon aria-hidden="true" />
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="h-16 rounded-2xl bg-white/60 transition duration-500 group-hover:-translate-y-1" />
                          <span className="h-16 rounded-2xl bg-white/42 transition duration-500 group-hover:-translate-y-2" />
                          <span className="h-16 rounded-2xl bg-white/60 transition duration-500 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative p-6">
                    <h3 className="text-xl font-bold text-ink">{space.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/67">{space.copy}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Facilities;
