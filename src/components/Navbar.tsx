import { useState } from 'react';
import { FaBars, FaPhone, FaXmark } from 'react-icons/fa6';
import type { NavItem, SiteSettings } from '../content/types';

type NavbarProps = {
  navigation: NavItem[];
  site: SiteSettings;
};

function Navbar({ navigation, site }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-cream/88 shadow-sm backdrop-blur-xl">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-4">
        <a href="#home" className="focus-ring flex items-center gap-3 rounded-full" onClick={closeMenu}>
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-sage/40 bg-white shadow-soft">
            <img
              src={site.logo}
              alt={site.logoAlt}
              className="h-full w-full object-contain p-0.5"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-ink sm:text-base">{site.shortName}</span>
            <span className="block text-xs font-medium text-ink/60">{site.subtitle}</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full text-sm font-semibold text-ink/70 transition hover:text-moss"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.contact.phoneHref}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-moss/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-moss transition hover:border-moss/30 hover:bg-white"
          >
            <FaPhone className="text-xs" aria-hidden="true" />
            Call Us
          </a>
          <a
            href="#contact"
            className="focus-ring rounded-full bg-moss px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
          >
            Inquire Now
          </a>
        </div>

        <button
          type="button"
          className="focus-ring grid h-11 w-11 place-items-center rounded-2xl border border-moss/15 bg-white/80 text-moss lg:hidden"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/70 bg-cream/96 px-5 pb-5 pt-2 shadow-soft lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring rounded-2xl px-4 py-3 text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-moss"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="focus-ring mt-2 rounded-2xl bg-moss px-4 py-3 text-center text-sm font-bold text-white"
              onClick={closeMenu}
            >
              Inquire Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
