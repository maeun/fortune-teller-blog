// Node.js 스크립트: Firestore에 샘플 포스트 업로드
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  credential: applicationDefault(),
  projectId: 'YOUR_PROJECT_ID',
});

const db = getFirestore();

async function addSamplePost() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const slug = `ai-fortune-${dateStr.replace(/-/g, '')}`;
  const post = {
    lang: 'ko',
    title: '오늘의 운세: AI가 전하는 메시지',
    content: 'AI가 분석한 오늘의 운세는... (샘플)',
    date: dateStr,
    imageUrl: '',
    slug,
  };
  await db.collection('posts').add(post);
  console.log('샘플 포스트 업로드 완료:', post);
}

addSamplePost();
