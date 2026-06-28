import {
  FaBrain,
  FaCapsules,
  FaComments,
  FaHandHoldingHeart,
  FaHouseUser,
  FaPersonWalkingWithCane,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { ServicesContent } from '../content/types';
import Reveal from './Reveal';

const serviceIcons: Record<ServicesContent['items'][number]['icon'], IconType> = {
  brain: FaBrain,
  capsules: FaCapsules,
  care: FaHandHoldingHeart,
  comments: FaComments,
  home: FaHouseUser,
  mobility: FaPersonWalkingWithCane,
};

type ServicesProps = {
  content: ServicesContent;
};

function Services({ content }: ServicesProps) {
  return (
    <section id="services" className="bg-mist/65 py-20 transition-colors duration-300 sm:py-24 dark:bg-[#0f220f]">
      <div className="section-shell">
        <Reveal className="max-w-4xl">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.copy}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Reveal key={service.title} delay={index * 85}>
                <article className="card-sheen group h-full rounded-3xl border border-white/80 bg-white/82 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-lift dark:border-white/10 dark:bg-white/10 dark:hover:border-linen/25">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage/15 text-2xl text-moss transition duration-300 group-hover:scale-105 group-hover:bg-moss group-hover:text-white dark:bg-linen/10 dark:text-linen dark:group-hover:bg-linen dark:group-hover:text-ink">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="relative">
                    <h3 className="mt-6 text-xl font-bold text-ink dark:text-white">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink/67 dark:text-white/66">{service.copy}</p>
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

export default Services;
