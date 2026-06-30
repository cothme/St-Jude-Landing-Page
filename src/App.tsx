import { useEffect, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import CursorGradient from './components/CursorGradient';
import Facilities from './components/Facilities';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import PrivacyPolicy from './components/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import siteContent from './content/siteContent';

export type ThemeMode = 'light' | 'dark';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const savedTheme = getSavedTheme();
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
  try {
    return window.localStorage.getItem('stjude-theme');
  } catch {
    return null;
  }
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem('stjude-theme', theme);
    } catch {
      // The theme still applies even when browser storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-cream text-ink transition-colors duration-300 dark:bg-[#071307] dark:text-white">
      <CursorGradient />
      <Navbar navigation={siteContent.navigation} site={siteContent.site} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero content={siteContent.hero} site={siteContent.site} />
        <About content={siteContent.about} />
        <Services content={siteContent.services} />
        <WhyChooseUs content={siteContent.whyChooseUs} />
        <Facilities content={siteContent.facilities} />
        <Contact content={siteContent.contact} site={siteContent.site} />
        <PrivacyPolicy content={siteContent.privacyPolicy} />
      </main>
      <Footer content={siteContent.footer} site={siteContent.site} />
      <ScrollToTop />
    </div>
  );
}

export default App;
