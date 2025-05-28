import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

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

const FloatingElement = ({ children, delay = 0, duration = 3 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 text-gray-900 p-6 flex flex-col items-center justify-start text-center">
      {/* 애니메이션 키프레임 정의 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="mb-10 w-full">
        <FloatingElement delay={200}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">🔮 {lang === "tr" ? "Mistik Blog" : "Mystical Blog"}</h1>
        </FloatingElement>
        <FloatingElement delay={400}>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            {lang === "tr"
              ? "Fal dünyasına dair yazılar burada."
              : "Explore writings about the world of fortune telling."}
          </p>
        </FloatingElement>
      </div>

      <div className="w-full max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {posts.map((post, index) => (
          <FloatingElement key={post.slug} delay={index * 200}>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 w-72 sm:w-80">
              <h2 className="text-xl font-semibold mb-2">{post.title[lang]}</h2>
              <p className="text-gray-600 mb-4">{post.preview[lang]}</p>
              <Link
                to={`/post/${post.slug}`}
                className="inline-block text-purple-600 font-medium hover:text-purple-800"
              >
                {lang === "tr" ? "Devamını oku →" : "Read more →"}
              </Link>
            </div>
          </FloatingElement>
        ))}
      </div>

      <div className="mt-12">
        <FloatingElement delay={1500}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 rounded-full text-purple-800 font-semibold shadow-sm">
            <Sparkles className="animate-pulse" size={20} />
            {lang === "tr" ? "Daha fazla içerik yakında..." : "More content coming soon..."}
          </div>
        </FloatingElement>
      </div>
    </div>
  );
}
