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

// fortune-telling structured 마크다운 생성 함수
function buildMarkdown({
  lang,
  topic,
  description,
  date,
  category,
  emoji,
  keywords,
}) {
  return (
    `---\n` +
    `title: ${topic}\n` +
    `description: ${description}\n` +
    `date: ${date}\n` +
    `category: ${category}\n` +
    `---\n\n` +
    `# ${topic} ${emoji}\n\n` +
    `_${description}_\n\n` +
    `Did you know that the date you were born on may hold the key to your personality, strengths, and even your destiny? For centuries, cultures across the world have believed that **your birth date is more than just a number**—it’s a symbol of who you are.\n\n` +
    `---\n\n` +
    `## 📅 Why Your Birth Date Matters\n\n` +
    `Your birth date is unique. It anchors you in time and space—and in many traditions, it's believed to influence your:\n\n` +
    `- 🧠 Personality traits\n` +
    `- 💖 Relationship compatibility\n` +
    `- 📈 Career path\n` +
    `- 🔮 Life purpose\n\n` +
    `Think of it as your cosmic signature. Just like your fingerprint, your birth date can reveal patterns about how you interact with the world.\n\n` +
    `---\n\n` +
    `## 🌌 Astrology and Your Birth Date\n\n` +
    `In **Western astrology**, your **Sun sign**—the zodiac sign based on your birth date—is considered one of the biggest indicators of personality.\n\n` +
    `| Zodiac Sign     | Date Range      | Key Traits                             |\n` +
    `| --------------- | --------------- | -------------------------------------- |\n` +
    `| Aries ♈️       | Mar 21 – Apr 19 | Bold, energetic, confident             |\n` +
    `| Taurus ♉️      | Apr 20 – May 20 | Loyal, patient, dependable             |\n` +
    `| Gemini ♊️      | May 21 – Jun 20 | Curious, adaptable, talkative          |\n` +
    `| Cancer ♋️      | Jun 21 – Jul 22 | Sensitive, nurturing, intuitive        |\n` +
    `| Leo ♌️         | Jul 23 – Aug 22 | Charismatic, proud, passionate         |\n` +
    `| Virgo ♍️       | Aug 23 – Sep 22 | Practical, analytical, detail-driven   |\n` +
    `| Libra ♎️       | Sep 23 – Oct 22 | Diplomatic, romantic, fair-minded      |\n` +
    `| Scorpio ♏️     | Oct 23 – Nov 21 | Intense, mysterious, determined        |\n` +
    `| Sagittarius ♐️ | Nov 22 – Dec 21 | Optimistic, adventurous, free-spirited |\n` +
    `| Capricorn ♑️   | Dec 22 – Jan 19 | Disciplined, responsible, ambitious    |\n` +
    `| Aquarius ♒️    | Jan 20 – Feb 18 | Visionary, independent, innovative     |\n` +
    `| Pisces ♓️      | Feb 19 – Mar 20 | Empathetic, dreamy, creative           |\n\n` +
    `---\n\n` +
    `## 🔢 Numerology and Birth Date Meaning\n\n` +
    `**Numerology** assigns significance to the numbers in your birth date. One popular method is calculating your **Life Path Number**, which is believed to describe your core purpose in life.\n\n` +
    `### ✨ Example:\n\n` +
    `For someone born on **July 19, 1995**, the Life Path calculation would be:\n\n` +
    '`7 + 1 + 9 + 1 + 9 + 9 + 5 = 41 → 4 + 1 = 5`  \n' +
    '➡️ Life Path Number = **5** (freedom, adaptability, communication)\n\n' +
    `Each number from 1 to 9 (and master numbers 11, 22, 33) carries a different vibration and meaning.\n\n` +
    `---\n\n` +
    `## 🤖 What AI Can Reveal About Your Birthday\n\n` +
    `Modern tools like **AI fortune telling apps** go beyond traditional interpretations. By analyzing your:\n\n` +
    `- Name\n` +
    `- Birth date\n` +
    `- Emotional concerns\n\n` +
    '…they generate a **personalized insight** using patterns, symbolism, and language models.\n\n' +
    `This fusion of ancient knowledge and advanced technology brings fortune telling into the digital age—making it easier than ever to discover what your birth date really says about you.\n\n` +
    `---\n\n` +
    `## 💡 Why People Keep Coming Back to Their Birth Date\n\n` +
    `Your birthday is one of the most **emotionally meaningful** dates in your life. People often turn to it during times of change or reflection to:\n\n` +
    `- Understand their identity\n` +
    `- Get clarity during difficult decisions\n` +
    `- Reconnect with their goals and values\n\n` +
    `Whether you’re a believer or just curious, birth date readings offer both fun and insight.\n\n` +
    `---\n\n` +
    `## 📈 SEO-Friendly Keywords\n\n` +
    (keywords && keywords.length ? keywords.map((k) => `- ${k}`).join('\n') + '\n' : '') +
    `---\n\n` +
    `## 🌐 Ready to Discover What Your Birthday Reveals?\n\n` +
    `Your birth date is more than a number—it’s a window into your soul.  \nTry a personalized, AI-powered birthday reading today.\n\n` +
    `👉 https://fortune-teller-fd566.web.app/\n`
  );
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
