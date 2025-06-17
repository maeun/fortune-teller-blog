import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        brand: "Fortune Teller Blog",
        home: "Home",
        blog: "Blog",
        about: "About",
        contact: "Contact",
      },
      categories: {
        fortune: "Fortune Telling",
        tarot: "Tarot Reading",
        dreams: "Dream Interpretation",
        horoscope: "Horoscope",
        numerology: "Numerology",
        palmistry: "Palm Reading",
        love: "Love & Relationships",
        career: "Career & Success",
        health: "Health & Wellness"
      },
      footer: {
        description: "Discover your destiny with our free fortune telling services. Get insights into your future through tarot readings, dream interpretation, and more.",
        quickLinks: "Quick Links",
        categories: "Categories",
        newsletter: "Newsletter",
        newsletterDescription: "Subscribe to our newsletter for the latest updates and insights.",
        emailPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },
      common: {
        readMore: "Read More",
        loading: "Loading...",
        error: "An error occurred. Please try again.",
        noResults: "No results found.",
        search: "Search",
        latestPosts: "Latest Posts",
        popularPosts: "Popular Posts",
        relatedPosts: "Related Posts",
        share: "Share",
        category: "Category",
        date: "Date",
        author: "Author",
        back: "Back",
        backToHome: "Back to Home",
        submit: "Submit",
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully!",
        error: "Failed to send message. Please try again.",
      },
      home: {
        hero: {
          title: "Discover Your Destiny",
          subtitle: "Free Fortune Telling Services",
          description: "Get insights into your future through tarot readings, dream interpretation, and more.",
          cta: "Start Reading",
        },
        features: {
          title: "Our Services",
          tarot: {
            title: "Tarot Reading",
            description: "Get personalized insights through tarot card readings.",
          },
          dreams: {
            title: "Dream Interpretation",
            description: "Understand the hidden meanings in your dreams.",
          },
          horoscope: {
            title: "Daily Horoscope",
            description: "Check your daily horoscope for guidance.",
          },
          numerology: {
            title: "Numerology",
            description: "Discover the power of numbers in your life.",
          },
          palmistry: {
            title: "Palm Reading",
            description: "Learn what your palm lines reveal about your future.",
          },
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
