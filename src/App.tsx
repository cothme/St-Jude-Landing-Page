import About from './components/About';
import Contact from './components/Contact';
import CursorGradient from './components/CursorGradient';
import Facilities from './components/Facilities';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import siteContent from './content/siteContent';

function App() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <CursorGradient />
      <Navbar navigation={siteContent.navigation} site={siteContent.site} />
      <main>
        <Hero content={siteContent.hero} site={siteContent.site} />
        <About content={siteContent.about} />
        <Services content={siteContent.services} />
        <WhyChooseUs content={siteContent.whyChooseUs} />
        <Facilities content={siteContent.facilities} />
        <Contact content={siteContent.contact} site={siteContent.site} />
      </main>
      <Footer content={siteContent.footer} site={siteContent.site} />
      <ScrollToTop />
    </div>
  );
}

export default App;
