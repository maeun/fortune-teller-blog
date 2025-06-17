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
      },
    },
  },
  ko: {
    translation: {
      nav: {
        brand: "포춘텔러 블로그",
        home: "홈",
        blog: "블로그",
        about: "소개",
        contact: "문의하기",
      },
      categories: {
        fortune: "운세",
        tarot: "타로",
        dreams: "꿈해몽",
      },
      footer: {
        description: "무료 운세 서비스로 당신의 운명을 발견하세요. 타로, 꿈해몽 등 다양한 서비스를 통해 미래를 알아보세요.",
        quickLinks: "바로가기",
        categories: "카테고리",
        newsletter: "뉴스레터",
        newsletterDescription: "최신 업데이트와 인사이트를 받아보세요.",
        emailPlaceholder: "이메일을 입력하세요",
        subscribe: "구독하기",
        rights: "모든 권리 보유.",
        privacy: "개인정보처리방침",
        terms: "이용약관",
      },
      common: {
        readMore: "더 보기",
        loading: "로딩 중...",
        error: "오류가 발생했습니다. 다시 시도해주세요.",
        noResults: "검색 결과가 없습니다.",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
