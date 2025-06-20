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

async function generateFortune(lang = 'ko') {
  // 언어별 프롬프트 예시
  const prompts = {
    ko: '오늘의 운세를 200자 이내로 AI가 친근하게 작성해줘. 제목도 한 줄로 포함해줘.',
    en: "Write today's fortune in a friendly tone within 200 characters. Include a catchy title.",
    ja: '今日の運勢を200文字以内でAIが親しみやすく書いてください。タイトルも含めてください。',
    tr: 'Bugünün falını 200 karakter içinde samimi bir dille yaz. Başlık da ekle.',
    zh: '请用200字以内的亲切语气写一篇今日运势，并加上标题。'
  };
  const prompt = prompts[lang] || prompts['ko'];
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a fortune-telling AI assistant.' },
      { role: 'user', content: prompt }
    ]
  });
  const text = res.choices[0].message.content.trim();
  // 제목/본문 분리 (제목은 첫 줄, 나머지는 본문)
  const [title, ...bodyArr] = text.split('\n');
  const content = bodyArr.join('\n').replace(/^\s*-\s*/, '');
  return { title: title.replace(/^\s*[-#*]\s*/, ''), content };
}

async function uploadFortunePost() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const slug = `ai-fortune-${dateStr.replace(/-/g, '')}`;
  const langs = ['ko', 'en', 'ja', 'tr', 'zh'];
  for (const lang of langs) {
    const { title, content } = await generateFortune(lang);
    const post = {
      lang,
      title,
      content,
      date: dateStr,
      imageUrl: '',
      slug,
    };
    await db.collection('posts').add(post);
    console.log(`[${lang}] 업로드 완료:`, title);
  }
}

uploadFortunePost();
