// src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaArrowLeft, FaShare, FaStar, FaTag } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Post() {
  const { lang, slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 언어 변경 시 해당 언어의 같은 slug로 이동
  useEffect(() => {
    if (i18n.language !== lang) {
      navigate(`/post/${i18n.language}/${slug}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [i18n.language, lang, slug, navigate]);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const q = query(
        collection(db, "posts"),
        where("lang", "==", lang),
        where("slug", "==", slug)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setPost(snap.docs[0].data());
      } else {
        setPost(null);
      }
      setLoading(false);
    }
    fetchPost();
  }, [lang, slug]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Loading...
      </div>
    );
  }
  if (!post) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100/60 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-full shadow hover:bg-purple-100 dark:hover:bg-gray-700 text-purple-700 dark:text-purple-300 font-semibold transition-colors"
        >
          <FaArrowLeft /> {t("back") || "Back"}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-4 md:p-10 mx-auto relative border border-purple-100 dark:border-purple-800"
      >
        {/* 대표 이미지 */}
        {(() => {
          console.log("post.imageUrl:", post.imageUrl);
          return (
            post.imageUrl && (
              <div className="w-full flex justify-center mb-8">
                <img
                  src={post.imageUrl}
                  alt={post.title || post.slug}
                  className="rounded-xl max-h-80 object-cover shadow-lg border border-purple-200 dark:border-purple-700"
                  style={{ width: "100%", maxWidth: 600 }}
                />
              </div>
            )
          );
        })()}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm flex-wrap">
            {/* 날짜는 사용자에게 노출하지 않음 */}
            {post.category && (
              <span className="flex items-center gap-2">
                <FaTag />
                {post.category}
              </span>
            )}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-semibold rounded-full shadow hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
          >
            <FaShare /> {t("share") || "Share"}
          </button>
        </div>
        {post.title && (
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-purple-800 dark:text-purple-200 mb-6 leading-tight">
            {post.title}
          </h1>
        )}
        {post.description && (
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {post.description}
          </p>
        )}
        <div
          className="text-lg leading-relaxed break-words prose prose-purple dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.div>
    </div>
  );
}

export default Post;
