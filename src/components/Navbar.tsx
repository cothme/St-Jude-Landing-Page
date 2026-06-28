import { useState } from 'react';
import { FaMoon, FaPhone, FaSun } from 'react-icons/fa6';
import type { ThemeMode } from '../App';
import type { NavItem, SiteSettings } from '../content/types';

type NavbarProps = {
  navigation: NavItem[];
  site: SiteSettings;
  theme: ThemeMode;
  onToggleTheme: () => void;
};

function Navbar({ navigation, site, theme, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const ThemeIcon = theme === 'dark' ? FaSun : FaMoon;

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-cream/88 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#081607]/88">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-4">
        <a href="#home" className="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-full lg:flex-none" onClick={closeMenu}>
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-sage/40 bg-white shadow-soft dark:border-sage/25 dark:bg-white/90">
            <img
              src={site.logo}
              alt={site.logoAlt}
              className="h-full w-full object-contain p-0.5"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-bold tracking-wide text-ink transition-colors sm:text-base dark:text-white">{site.shortName}</span>
            <span className="block truncate text-xs font-medium text-ink/60 transition-colors dark:text-white/60">{site.subtitle}</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full text-sm font-semibold text-ink/70 transition hover:text-moss dark:text-white/70 dark:hover:text-linen"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.contact.phoneHref}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-moss/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-moss transition hover:border-moss/30 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-linen dark:hover:border-linen/30 dark:hover:bg-white/15"
          >
            <FaPhone className="text-xs" aria-hidden="true" />
            Call Us
          </a>
          <button
            type="button"
            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-moss/15 bg-white/70 text-moss transition hover:border-moss/30 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-linen dark:hover:border-linen/30 dark:hover:bg-white/15"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={onToggleTheme}
          >
            <ThemeIcon className="text-sm" aria-hidden="true" />
          </button>
          <a
            href="#contact"
            className="focus-ring rounded-full bg-moss px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink dark:bg-linen dark:text-ink dark:hover:bg-white"
          >
            Inquire Now
          </a>
        </div>

        <button
          type="button"
          className="focus-ring hamburger-button grid h-11 w-11 place-items-center rounded-2xl border border-moss/15 bg-white/80 text-moss transition dark:border-white/10 dark:bg-white/10 dark:text-linen lg:hidden"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          data-open={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </nav>

      <div
        aria-hidden={!isOpen}
        className={`mobile-menu overflow-hidden border-t border-white/70 bg-cream/96 px-5 shadow-soft transition-[opacity,transform,max-height,padding] duration-300 ease-out dark:border-white/10 dark:bg-[#081607]/96 lg:hidden ${
          isOpen ? 'max-h-[calc(100vh-5rem)] translate-y-0 overflow-y-auto pb-5 pt-2 opacity-100' : 'pointer-events-none max-h-0 -translate-y-2 py-0 opacity-0'
        }`}
      >
        <div className="mx-auto grid max-w-7xl gap-2">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring rounded-2xl px-4 py-3 text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-moss dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-linen"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="focus-ring flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-moss dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-linen"
            onClick={() => {
              onToggleTheme();
              closeMenu();
            }}
          >
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            <ThemeIcon aria-hidden="true" />
          </button>
          <a
            href="#contact"
            className="focus-ring mt-2 rounded-2xl bg-moss px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-ink dark:bg-linen dark:text-ink dark:hover:bg-white"
            onClick={closeMenu}
          >
            Inquire Now
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
