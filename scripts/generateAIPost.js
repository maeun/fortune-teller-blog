// Node.js: OpenAI API로 오늘의 운세 포스트 생성 후 Firestore에 업로드
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 환경 변수에서 키 불러오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

initializeApp({
  credential: applicationDefault(),
  projectId: FIREBASE_PROJECT_ID,
});
const db = getFirestore();

// 번역 함수(OpenAI 활용)
async function translateText(text, targetLang) {
  if (targetLang === "en") return text;
  const prompt = {
    ko: `Translate the following text to Korean:\n${text}`,
    tr: `Translate the following text to Turkish:\n${text}`,
  };
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a professional translator." },
      { role: "user", content: prompt[targetLang] },
    ],
  });
  return res.choices[0].message.content.trim();
}

// 대표 이미지 생성 (OpenAI DALL·E)
async function generateImageUrl(prompt, lang) {
  let translatedPrompt = prompt;
  if (lang !== "en") {
    translatedPrompt = await translateText(prompt, lang);
  }
  const dalleRes = await openai.images.generate({
    prompt: translatedPrompt,
    n: 1,
    size: "512x512",
    response_format: "url",
  });
  return dalleRes.data?.[0]?.url || "";
}

// fortune-telling 관련 랜덤 주제 1개 생성 (영어)
async function getRandomFortuneTopicEn() {
  const prompt =
    "Suggest a unique, interesting topic for a fortune-telling blog post. The topic should be related to fortune-telling, astrology, divination, or spiritual insight. Respond with only the topic title, no explanation.";
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a creative fortune-telling blog writer.",
      },
      { role: "user", content: prompt },
    ],
  });
  return res.choices[0].message.content.trim().replace(/^[-#*]\s*/, "");
}

// fortune-telling structured post 생성 (본문도 AI가 생성)
function cleanContent(content) {
  // Remove YAML frontmatter (--- ... ---)
  content = content.replace(/^---[\s\S]*?---/gm, "");
  // Remove markdown/html title headers (e.g. #, ##, <h1>, <h2>, etc.)
  content = content.replace(/^#+\s.*$/gm, "");
  content = content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, "");
  // Remove lines starting with title, category, keywords, description, date, slug, etc.
  content = content.replace(/^(title|category|keywords?|description|date|slug)\s*[:：].*$/gim, "");
  // Remove markdown/html tables
  content = content.replace(/\|[^\n]*\|/g, "");
  content = content.replace(/<table[\s\S]*?<\/table>/gi, "");
  // Remove example, CTA, promotional, astrology, numerology, AI, link, etc. sections (including Turkish/Korean)
  content = content.replace(/(예시|example|call to action|cta|홍보문구|astrology|numerology|AI|인공지능|키워드|keywords?|링크|link|frontmatter|yaml|표|table|zodiac|birth ?date|생년월일|생일|수비학|점성술|태어난 날|AI fortune|AI-powered|https?:\/\/\S+|\[.*?\]\(.*?\)|SEO-Friendly Keywords|SEO keywords|SEO 키워드|SEO\s*:)/gim, "");
  // Remove blockquotes, images, and any remaining markdown artifacts
  content = content.replace(/^>.*$/gm, "");
  content = content.replace(/!\[.*?\]\(.*?\)/g, "");
  // Remove repeated empty lines
  content = content.replace(/\n{3,}/g, "\n\n");
  // Remove leading/trailing whitespace and empty lines
  content = content.replace(/^[ \t]*\n/gm, "");
  return content.trim();
}

async function buildPost({ lang, topic, date, category, emoji }) {
  // 설명 생성
  const descPrompt = `Write a one-sentence description for a fortune-telling blog post titled: "${topic}". Respond in ${
    lang === "en" ? "English" : lang === "ko" ? "Korean" : "Turkish"
  }.`;
  const descRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a fortune-telling blog writer." },
      { role: "user", content: descPrompt },
    ],
  });
  const description = descRes.choices[0].message.content.trim();
  // 카테고리 번역
  let categoryTranslated = category;
  if (lang !== "en") categoryTranslated = await translateText(category, lang);
  // 키워드 생성
  const kwPrompt = `Suggest 12 SEO-friendly keywords for a fortune-telling blog post about \"${topic}\" in the category \"${categoryTranslated}\". Respond as a comma-separated list only in ${
    lang === "en" ? "English" : lang === "ko" ? "Korean" : "Turkish"
  }.`;
  const kwRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an SEO expert for fortune-telling blogs.",
      },
      { role: "user", content: kwPrompt },
    ],
  });
  const keywordsArr = kwRes.choices[0].message.content
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  // 본문 생성 (불필요한 섹션, 헤더, 표, 예시, 홍보문구, AI, astrology, numerology, CTA, 링크, 키워드, description, title, category 등 완전 금지)
  const bodyPrompt = `Write a long, detailed, SEO-optimized fortune-telling blog post about the topic: "${topic}" in the category "${categoryTranslated}". The content MUST NOT include any of the following: title, category, description, keywords, any promotional or call-to-action text, any example, any table, any markdown header, any YAML frontmatter, any section or mention about birthdays, zodiac, astrology, numerology, AI, links, or SEO keywords. Focus ONLY on the topic and category. Write only the main body content, as if it is a single, uninterrupted article. Respond in ${
    lang === "en" ? "English" : lang === "ko" ? "Korean" : "Turkish"
  }.`;
  const bodyRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a fortune-telling blog writer." },
      { role: "user", content: bodyPrompt },
    ],
  });
  const body = bodyRes.choices[0].message.content.trim();
  // 본문 후처리
  const cleanedBody = cleanContent(body);
  // 대표 이미지 생성
  const imagePrompt = `A beautiful, eye-catching illustration for a fortune-telling blog post about: ${topic} (${categoryTranslated}), mystical, magical, trending on artstation, 512x512`;
  const imageUrl = await generateImageUrl(imagePrompt, lang);
  // 반환
  return {
    description,
    category: categoryTranslated,
    keywords: keywordsArr,
    content: cleanedBody,
    imageUrl,
  };
}

async function uploadFortunePost() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace("T", " "); // YYYY-MM-DD HH:mm
  const slug = `ai-fortune-${now
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 12)}`;
  const langs = ["en", "ko", "tr"];
  // 1. 영어로 fortune-telling 주제 1개 생성
  const topicEn = await getRandomFortuneTopicEn();
  // 2. 각 언어별로 주제 번역
  const topicKo = await translateText(topicEn, "ko");
  const topicTr = await translateText(topicEn, "tr");
  const topics = { en: topicEn, ko: topicKo, tr: topicTr };
  const categories = { en: "Fortune-telling", ko: "운세", tr: "Fal" };
  for (const lang of langs) {
    const postData = await buildPost({
      lang,
      topic: topics[lang],
      date: dateStr,
      category: categories[lang],
      emoji: "🔮",
    });
    const post = {
      lang,
      title: topics[lang],
      category: postData.category,
      description: postData.description,
      content: postData.content,
      keywords: postData.keywords,
      date: dateStr,
      imageUrl: postData.imageUrl,
      slug,
    };
    await db.collection("posts").add(post);
    console.log(`[${lang}] 업로드 완료:`, post.title);
  }
}

uploadFortunePost();
