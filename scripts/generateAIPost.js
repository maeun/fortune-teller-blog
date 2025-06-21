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

const topics = [
  {
    topic: {
      en: "What Your Birth Date Says About You",
      tr: "Doğum Tarihiniz Sizin Hakkınızda Ne Söylüyor?",
      ko: "당신의 생일이 말해주는 것",
      ja: "誕生日が語るあなたの本質",
      zh: "你的生日透露了什么",
    },
    description: {
      en: "Discover the secrets hidden in your birthday.",
      tr: "Doğum gününüzde saklı sırları keşfedin.",
      ko: "생일에 숨겨진 비밀을 알아보세요.",
      ja: "誕生日に隠された秘密を発見しましょう。",
      zh: "发现你生日中隐藏的秘密。",
    },
    category: {
      en: "Astrology",
      tr: "Astroloji",
      ko: "점성술",
      ja: "占星術",
      zh: "占星术",
    },
    emoji: "🎂✨",
    keywords: {
      en: [
        "what your birth date means",
        "birth date personality traits",
        "zodiac sign by birth date",
        "life path number calculator",
        "numerology birth date reading",
        "birthday fortune meaning",
        "AI horoscope by birth date",
        "personalized astrology insight",
        "what does my birthdate say about me",
        "spiritual meaning of birth dates",
      ],
      tr: [
        "doğum tarihi anlamı",
        "doğum tarihi kişilik özellikleri",
        "burçlar ve doğum tarihi",
        "yaşam yolu numarası hesaplama",
        "numeroloji doğum tarihi yorumu",
        "doğum günü falı",
        "AI doğum tarihi burç yorumu",
        "kişiselleştirilmiş astroloji",
        "doğum tarihim ne söylüyor",
        "doğum tarihinin manevi anlamı",
      ],
      // ...ko, ja, zh도 필요시 추가
    },
  },
  // ...다른 fortune-telling 주제 추가 가능
];

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
    "`7 + 1 + 9 + 1 + 9 + 9 + 5 = 41 → 4 + 1 = 5`  \n" +
    "➡️ Life Path Number = **5** (freedom, adaptability, communication)\n\n" +
    `Each number from 1 to 9 (and master numbers 11, 22, 33) carries a different vibration and meaning.\n\n` +
    `---\n\n` +
    `## 🤖 What AI Can Reveal About Your Birthday\n\n` +
    `Modern tools like **AI fortune telling apps** go beyond traditional interpretations. By analyzing your:\n\n` +
    `- Name\n` +
    `- Birth date\n` +
    `- Emotional concerns\n\n` +
    "…they generate a **personalized insight** using patterns, symbolism, and language models.\n\n" +
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
    (keywords && keywords.length
      ? keywords.map((k) => `- ${k}`).join("\n") + "\n"
      : "") +
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
  const langs = ["ko", "en", "tr"]; // 필요시 ja, zh 추가
  // 랜덤 주제 선택
  const topicObj = topics[Math.floor(Math.random() * topics.length)];
  for (const lang of langs) {
    const post = {
      lang,
      title: topicObj.topic[lang],
      content: buildMarkdown({
        lang,
        topic: topicObj.topic[lang],
        description: topicObj.description[lang],
        date: dateStr,
        category: topicObj.category[lang],
        emoji: topicObj.emoji,
        keywords: topicObj.keywords[lang] || [],
      }),
      date: dateStr,
      imageUrl: "",
      slug,
      category: topicObj.category[lang],
    };
    await db.collection("posts").add(post);
    console.log(`[${lang}] 업로드 완료:`, post.title);
  }
}

uploadFortunePost();
