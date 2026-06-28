import { FaCheckCircle } from 'react-icons/fa';
import type { WhyChooseUsContent } from '../content/types';
import Reveal from './Reveal';

type WhyChooseUsProps = {
  content: WhyChooseUsContent;
};

function WhyChooseUs({ content }: WhyChooseUsProps) {
  return (
    <section id="why-us" className="bg-white py-20 transition-colors duration-300 sm:py-24 dark:bg-[#0a180a]">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal className="rounded-[2rem] bg-care-gradient p-6 shadow-lift sm:p-8 dark:bg-[linear-gradient(135deg,rgba(19,42,19,0.95)_0%,rgba(49,86,45,0.64)_100%)]">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/72 p-6 backdrop-blur dark:border-white/10 dark:bg-white/10">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="section-heading">{content.heading}</h2>
            <p className="section-copy">{content.copy}</p>
          </div>
        </Reveal>

        <div className="grid gap-4">
          {content.reasons.map((reason, index) => (
            <Reveal key={reason} delay={index * 85}>
              <div className="card-sheen group flex gap-4 rounded-3xl border border-moss/10 bg-cream p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:bg-white hover:shadow-soft dark:border-white/10 dark:bg-white/10 dark:hover:border-linen/25 dark:hover:bg-white/15">
                <FaCheckCircle className="relative mt-1 shrink-0 text-xl text-sage transition group-hover:scale-110 group-hover:text-moss dark:text-linen dark:group-hover:text-sage" aria-hidden="true" />
                <p className="relative text-base font-semibold leading-7 text-ink/76 dark:text-white/74">{reason}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
