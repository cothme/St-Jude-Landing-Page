export type CtaContent = {
  label: string;
  href: string;
};

export type SiteContent = {
  site: SiteSettings;
  navigation: NavItem[];
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  whyChooseUs: WhyChooseUsContent;
  facilities: FacilitiesContent;
  contact: ContactContent;
  footer: FooterContent;
};

export type SiteSettings = {
  shortName: string;
  subtitle: string;
  fullName: string;
  tagline: string;
  summary: string;
  logo: string;
  logoAlt: string;
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    address: string;
  };
};

export type NavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: CtaContent;
  secondaryCta: CtaContent;
  highlights: string[];
  floatingCard: {
    title: string;
    copy: string;
  };
  snapshot: {
    eyebrow: string;
    heading: string;
    stats: {
      value: string;
      label: string;
    }[];
    rhythmTitle: string;
    rhythmBadge: string;
    rhythmItems: string[];
    values: string[];
  };
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  principles: {
    icon: 'shield' | 'hands' | 'family';
    title: string;
    copy: string;
  }[];
};

export type ServicesContent = {
  eyebrow: string;
  heading: string;
  copy: string;
  items: {
    icon: 'brain' | 'home' | 'mobility' | 'capsules' | 'care' | 'comments';
    title: string;
    copy: string;
  }[];
};

export type WhyChooseUsContent = {
  eyebrow: string;
  heading: string;
  copy: string;
  reasons: string[];
};

export type FacilitiesContent = {
  eyebrow: string;
  heading: string;
  copy: string;
  spaces: {
    icon: 'moon' | 'sun' | 'leaf';
    title: string;
    copy: string;
    gradient: 'harbor-mist' | 'sage-linen' | 'moss-cream';
    image?: string;
    imageAlt?: string;
  }[];
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  copy: string;
  detailCards: {
    icon: 'phone' | 'email' | 'location';
    title: string;
    detailKey: 'phone' | 'email' | 'address';
  }[];
  form: {
    relationships: string[];
    successMessage: string;
  };
};

export type FooterContent = {
  links: NavItem[];
  copyright: string;
};
