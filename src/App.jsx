import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n"; // i18n 설정 파일을 import
import Home from "./pages/Home";
import Post from "./pages/Post";

export default function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navigation */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-700">
            🔮 Fortune Blog
          </Link>
          <div className="space-x-2">
            <button
              onClick={() => changeLanguage("en")}
              className="hover:opacity-70"
            >
              🇬🇧
            </button>
            <button
              onClick={() => changeLanguage("tr")}
              className="hover:opacity-70"
            >
              🇹🇷
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<Post />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white text-center text-sm text-gray-500 py-4">
          <p>&copy; 2025 Fortune Blog</p>
          <p>
            👉{" "}
            <a
              href="https://fortune-teller-fd566.web.app"
              className="text-purple-600 underline hover:text-purple-800"
            >
              Go to Fortune Teller Site
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}
