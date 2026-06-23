import { FaHandsHoldingCircle, FaPeopleRoof, FaUserShield } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { AboutContent } from '../content/types';
import Reveal from './Reveal';

const principleIcons: Record<AboutContent['principles'][number]['icon'], IconType> = {
  family: FaPeopleRoof,
  hands: FaHandsHoldingCircle,
  shield: FaUserShield,
};

type AboutProps = {
  content: AboutContent;
};

function About({ content }: AboutProps) {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          {content.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? 'section-copy' : 'mt-5 text-base leading-8 text-ink/68'}>
              {paragraph}
            </p>
          ))}
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {content.principles.map((item, index) => {
            const Icon = principleIcons[item.icon];
            return (
              <Reveal key={item.title} delay={index * 110}>
                <article className="card-sheen group rounded-3xl border border-moss/10 bg-cream p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-soft">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-xl text-harbor transition group-hover:scale-105 group-hover:bg-harbor group-hover:text-white">
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="relative">
                      <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-ink/68">{item.copy}</p>
                    </div>
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

export default About;
