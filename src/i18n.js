import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      blogTitle: "Fortune Blog",
      blogIntro:
        "Insights and stories about fortune telling. Read and discover your fate!",
      readMore: "Read more",
      goToFortune: "Go to Fortune Teller",
      notFound: "Post not found",
    },
  },
  tr: {
    translation: {
      blogTitle: "Fal Blogu",
      blogIntro:
        "Fal hakkındaki içgörüler ve hikayeler. Okuyun ve kaderinizi keşfedin!",
      readMore: "Devamını oku",
      goToFortune: "Fal Bakmaya Git",
      notFound: "Yazı bulunamadı",
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
