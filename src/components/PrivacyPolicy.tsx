import { FaClockRotateLeft, FaEnvelope, FaFileShield, FaHandHoldingHeart, FaLock, FaUserShield } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { PrivacyPolicyContent } from '../content/types';
import Reveal from './Reveal';

type PrivacyPolicyProps = {
  content: PrivacyPolicyContent;
};

const policyIcons: IconType[] = [
  FaUserShield,
  FaFileShield,
  FaHandHoldingHeart,
  FaLock,
  FaClockRotateLeft,
  FaEnvelope,
];

function PrivacyPolicy({ content }: PrivacyPolicyProps) {
  return (
    <section id="privacy-policy" className="bg-cream py-20 transition-colors duration-300 sm:py-24 dark:bg-[#071307]">
      <div className="section-shell">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-heading">{content.heading}</h2>
          <p className="section-copy">{content.copy}</p>
          <p className="mt-4 text-sm font-semibold text-ink/52 dark:text-white/52">Last updated: {content.lastUpdated}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.sections.map((section, index) => {
            const Icon = policyIcons[index % policyIcons.length];
            return (
              <Reveal key={section.title} delay={index * 70}>
                <article className="card-sheen h-full rounded-3xl border border-moss/10 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sage/40 hover:shadow-soft dark:border-white/10 dark:bg-white/10 dark:hover:border-linen/25">
                  <div className="relative flex gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-harbor dark:bg-linen/10 dark:text-linen">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink dark:text-white">{section.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-ink/68 dark:text-white/68">{section.copy}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-moss/10 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm font-semibold leading-7 text-ink/68 dark:text-white/68">
              For questions about privacy or requests related to your information, contact St. Jude's directly.
            </p>
            <a
              href={content.contactCta.href}
              className="focus-ring inline-flex shrink-0 items-center justify-center rounded-full bg-moss px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink dark:bg-linen dark:text-ink dark:hover:bg-white"
            >
              {content.contactCta.label}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
