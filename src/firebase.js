// Firebase 초기화 및 Firestore 인스턴스 export
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWwzbcK7TeRyoC2xx4DsdLveCXPq1_070",
  authDomain: "fortune-teller-blog.firebaseapp.com",
  projectId: "fortune-teller-blog",
  storageBucket: "fortune-teller-blog.appspot.com", // 올바른 storageBucket
  messagingSenderId: "929273238376",
  appId: "1:929273238376:web:e49fb5702622c34b74fcdd",
  measurementId: "G-H3YDDDT896",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
