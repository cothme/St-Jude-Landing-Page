import type { FooterContent, SiteSettings } from '../content/types';

type FooterProps = {
  content: FooterContent;
  site: SiteSettings;
};

function Footer({ content, site }: FooterProps) {
  const contactDetails = [site.contact.phone, site.contact.email, site.contact.address].filter((detail) => detail.trim());

  return (
    <footer className="bg-ink py-12 text-white">
      <div className="section-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-white/20 bg-white">
              <img
                src={site.logo}
                alt={site.logoAlt}
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <div>
              <p className="font-bold">{site.fullName}</p>
              <p className="text-sm text-white/62">{site.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/68">{site.summary}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/48">Quick links</h3>
          <div className="mt-4 grid gap-3">
            {content.links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-semibold text-white/70 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/48">Contact</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/70">
            {contactDetails.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-white/10 pt-6 text-sm text-white/48">
        <p>Copyright {new Date().getFullYear()} {site.fullName}. {content.copyright}</p>
      </div>
    </footer>
  );
}

export default Footer;
