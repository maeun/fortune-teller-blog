import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const posts = [
  {
    slug: 'what-is-fortune',
    title: { en: 'What is Fortune Telling?', tr: 'Fal Nedir?' },
    preview: {
      en: 'Discover how fortune telling evolved from ancient rituals to AI-powered insights.',
      tr: 'Falcılık, kadim ritüellerden yapay zekâ destekli yorumlara nasıl evrildi, keşfedin.',
    },
  },
  {
    slug: 'ai-and-destiny',
    title: { en: 'Can AI Predict Destiny?', tr: 'Yapay Zekâ Kaderi Tahmin Edebilir mi?' },
    preview: {
      en: 'Explore how artificial intelligence is transforming the way we reflect on the future.',
      tr: 'Yapay zekâ, geleceğe dair düşünme biçimimizi nasıl dönüştürüyor, inceleyin.',
    },
  },
  {
    slug: 'future-trends',
    title: { en: 'Future Trends in Fortune Tech', tr: 'Geleceğin Fal Teknolojileri' },
    preview: {
      en: 'From voice-based predictions to holographic oracles, the future is digital.',
      tr: 'Sesli kehanetlerden holografik falcılara kadar falcılığın dijital geleceği.',
    },
  },
  {
    slug: 'origin-of-fortune',
    title: {
      en: 'When Did People Start Believing in Fortune Telling?',
      tr: 'İnsanlar Falcılıkla Ne Zaman İlgilenmeye Başladı?',
    },
    preview: {
      en: 'Journey through history to uncover how fortune telling began and why it still thrives.',
      tr: 'Falcılığın tarihsel kökenlerine yolculuk ve günümüzde neden hâlâ popüler olduğunun cevabı.',
    },
  },
  {
    slug: 'birth-date-meaning',
    title: {
      en: 'What Your Birth Date Says About You',
      tr: 'Doğum Tarihin Senin Hakkında Ne Söylüyor?',
    },
    preview: {
      en: 'Your birthday might reveal your personality, life path, and hidden traits.',
      tr: 'Doğum tarihin, kişiliğini ve yaşam yolunu nasıl yansıtıyor, birlikte keşfedelim.',
    },
  },
];


export default function Home() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📚 Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.slug} className="p-4 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold">{post.title[lang]}</h2>
            <p className="text-gray-600 mb-2">{post.preview[lang]}</p>
            <Link
              to={`/post/${post.slug}`}
              className="text-purple-600 underline hover:text-purple-800"
            >
              {lang === "tr" ? "Devamını oku →" : "Read more →"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
