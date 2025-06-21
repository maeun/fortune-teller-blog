// Node.js: OpenAI API로 오늘의 운세 포스트 생성 후 Firestore에 업로드
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// 환경 변수에서 키 불러오기
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

initializeApp({
  credential: applicationDefault(),
  projectId: FIREBASE_PROJECT_ID,
});
const db = getFirestore();

// 번역 함수(OpenAI 활용)
async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  const prompt = {
    ko: `Translate the following text to Korean:\n${text}`,
    tr: `Translate the following text to Turkish:\n${text}`,
  };
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a professional translator.' },
      { role: 'user', content: prompt[targetLang] },
    ],
  });
  return res.data.choices[0].message.content.trim();
}

// fortune-telling 관련 랜덤 주제 1개 생성 (영어)
async function getRandomFortuneTopicEn() {
  const prompt = 'Suggest a unique, interesting topic for a fortune-telling blog post. The topic should be related to fortune-telling, astrology, divination, or spiritual insight. Respond with only the topic title, no explanation.';
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a creative fortune-telling blog writer.' },
      { role: 'user', content: prompt },
    ],
  });
  return res.data.choices[0].message.content.trim().replace(/^[-#*]\s*/, '');
}

// fortune-telling structured post 생성 (본문도 AI가 생성)
async function buildPost({ lang, topic, date, category, emoji }) {
  // 설명 생성
  const descPrompt = `Write a one-sentence description for a fortune-telling blog post titled: "${topic}". Respond in ${lang === 'en' ? 'English' : lang === 'ko' ? 'Korean' : 'Turkish'}.`;
  const descRes = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a fortune-telling blog writer.' },
      { role: 'user', content: descPrompt },
    ],
  });
  const description = descRes.data.choices[0].message.content.trim();
  // 키워드 생성
  const kwPrompt = `Suggest 8 SEO-friendly keywords for a fortune-telling blog post titled: "${topic}". Respond as a comma-separated list only in ${lang === 'en' ? 'English' : lang === 'ko' ? 'Korean' : 'Turkish'}.`;
  const kwRes = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an SEO expert for fortune-telling blogs.' },
      { role: 'user', content: kwPrompt },
    ],
  });
  const keywordsArr = kwRes.data.choices[0].message.content.split(',').map(k => k.trim()).filter(Boolean);
  // 본문 생성
  const bodyPrompt = `Write a detailed, engaging fortune-telling blog post about the topic: "${topic}". Use markdown, include sections, and make it informative and fun. Respond in ${lang === 'en' ? 'English' : lang === 'ko' ? 'Korean' : 'Turkish'}.`;
  const bodyRes = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a fortune-telling blog writer.' },
      { role: 'user', content: bodyPrompt },
    ],
  });
  const body = bodyRes.data.choices[0].message.content.trim();
  // 마크다운 조립
  return (
    `---\n` +
    `title: ${topic}\n` +
    `description: ${description}\n` +
    `date: ${date}\n` +
    `category: ${category}\n` +
    `---\n\n` +
    body +
    `\n\n## 📈 SEO-Friendly Keywords\n\n` +
    (keywordsArr.length ? keywordsArr.map(k => `- ${k}`).join('\n') + '\n' : '') +
    `---\n`);
}

async function uploadFortunePost() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const slug = `ai-fortune-${dateStr.replace(/-/g, '')}`;
  const langs = ['en', 'ko', 'tr'];
  // 1. 영어로 fortune-telling 주제 1개 생성
  const topicEn = await getRandomFortuneTopicEn();
  // 2. 각 언어별로 주제 번역
  const topicKo = await translateText(topicEn, 'ko');
  const topicTr = await translateText(topicEn, 'tr');
  const topics = { en: topicEn, ko: topicKo, tr: topicTr };
  for (const lang of langs) {
    const post = {
      lang,
      title: topics[lang],
      content: await buildPost({
        lang,
        topic: topics[lang],
        date: dateStr,
        category: lang === 'en' ? 'Fortune-telling' : lang === 'ko' ? '운세' : 'Fal',
        emoji: '🔮',
      }),
      date: dateStr,
      imageUrl: '',
      slug,
      category: lang === 'en' ? 'Fortune-telling' : lang === 'ko' ? '운세' : 'Fal',
    };
    await db.collection('posts').add(post);
    console.log(`[${lang}] 업로드 완료:`, post.title);
  }
}

uploadFortunePost();
