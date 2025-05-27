import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const posts = [
  {
    slug: "example",
    title: {
      en: "What is Fortune Telling?",
      tr: "Fal Nedir?",
    },
    preview: {
      en: "Let’s explore how AI meets ancient wisdom in modern fortune telling.",
      tr: "Yapay zekânın geleneksel fal kültürüyle nasıl buluştuğunu keşfedin.",
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
