// Node.js: OpenAI API로 오늘의 운세 포스트 생성 후 Firestore에 업로드
require('dotenv').config();
const OpenAI = require('openai');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// 환경 변수에서 키 불러오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

initializeApp({
  credential: applicationDefault(),
  projectId: FIREBASE_PROJECT_ID,
});
const db = getFirestore();

// fortune-telling 관련 랜덤 주제 생성
async function getRandomFortuneTopic(lang = "en") {
  const prompt = {
    en: "Suggest a unique, interesting topic for a fortune-telling blog post. The topic should be related to fortune-telling, astrology, divination, or spiritual insight. Respond with only the topic title, no explanation.",
    ko: "운세, 점성술, 영적 통찰 등과 관련된 블로그 포스트 주제를 하나 제안해줘. 주제 제목만 한 줄로 답해줘.",
    tr: "Fal, astroloji veya ruhsal içgörüyle ilgili bir blog yazısı için ilginç bir konu başlığı öner. Sadece başlık olarak yanıtla.",
  };
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a creative fortune-telling blog writer." },
      { role: "user", content: prompt[lang] || prompt["en"] },
    ],
  });
  return res.choices[0].message.content.trim().replace(/^[-#*]\s*/, "");
}

// fortune-telling structured post 생성
async function buildPost({ lang, topic, date, category, emoji, keywords, description }) {
  // description이 없으면 topic을 활용해 간단히 생성
  const descPrompt = {
    en: `Write a one-sentence description for a fortune-telling blog post titled: "${topic}"`,
    ko: `"${topic}"라는 제목의 운세 블로그 포스트에 어울리는 한 문장 설명을 작성해줘.`,
    tr: `"${topic}" başlıklı bir fal blog yazısı için tek cümlelik açıklama yaz.`,
  };
  let desc = description;
  if (!desc) {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a fortune-telling blog writer." },
        { role: "user", content: descPrompt[lang] || descPrompt["en"] },
      ],
    });
    desc = res.choices[0].message.content.trim();
  }
  // 키워드 생성
  const kwPrompt = {
    en: `Suggest 8 SEO-friendly keywords for a fortune-telling blog post titled: "${topic}". Respond as a comma-separated list only.`,
    ko: `"${topic}"라는 제목의 운세 블로그 포스트에 어울리는 SEO 키워드 8개를 콤마로 구분해 제안해줘.`,
    tr: `"${topic}" başlıklı bir fal blog yazısı için 8 SEO anahtar kelimesi öner. Sadece virgülle ayır.`,
  };
  let keywordsArr = keywords;
  if (!keywordsArr) {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an SEO expert for fortune-telling blogs." },
        { role: "user", content: kwPrompt[lang] || kwPrompt["en"] },
      ],
    });
    keywordsArr = res.choices[0].message.content.split(",").map((k) => k.trim()).filter(Boolean);
  }
  // 마크다운 본문 생성
  return buildMarkdown({
    lang,
    topic,
    description: desc,
    date,
    category,
    emoji,
    keywords: keywordsArr,
  });
}

async function uploadFortunePost() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const slug = `ai-fortune-${dateStr.replace(/-/g, "")}`;
  const langs = ["ko", "en", "tr"];
  // 영어 기준 랜덤 fortune-telling 주제 생성
  const topicEn = await getRandomFortuneTopic("en");
  // 각 언어별 번역된 주제 생성
  const topicKo = await getRandomFortuneTopic("ko");
  const topicTr = await getRandomFortuneTopic("tr");
  const topics = { en: topicEn, ko: topicKo, tr: topicTr };
  for (const lang of langs) {
    const post = {
      lang,
      title: topics[lang],
      content: await buildPost({
        lang,
        topic: topics[lang],
        date: dateStr,
        category: lang === "en" ? "Fortune-telling" : lang === "ko" ? "운세" : "Fal",
        emoji: "🔮",
      }),
      date: dateStr,
      imageUrl: "",
      slug,
      category: lang === "en" ? "Fortune-telling" : lang === "ko" ? "운세" : "Fal",
    };
    await db.collection("posts").add(post);
    console.log(`[${lang}] 업로드 완료:`, post.title);
  }
}

uploadFortunePost();
