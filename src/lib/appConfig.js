/**
 * Centralized application configuration
 * All hardcoded contact info, URLs, and settings should be sourced here
 */

export const appConfig = {
  // Contact Information
  contact: {
    phone: import.meta.env.VITE_COMPANY_PHONE || '(818) 300-2642',
    email: import.meta.env.VITE_COMPANY_EMAIL || 'bennett@buywiser.com',
  },

  // External URLs
  urls: {
    calendly: import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/buywiser',
    blinkMortgage: import.meta.env.VITE_BLINK_MORTGAGE_URL || 'https://www.blink.mortgage/app/signup/p/Buywiser/bennettliss?campaign=BennettLiss',
    googleMaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  },

  // Company Information
  company: {
    name: 'BuyWiser',
    nmls: '1887767',
    personalNmls: '1524446',
    caReeLicense: '01107013',
    tagline: "California's Boutique Mortgage Experts Since 1991",
  },

  // Links
  links: {
    youtube: {
      testimonials: 'https://www.youtube.com/embed/VIDEO_ID',
    },
  },
};