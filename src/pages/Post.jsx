// src/pages/Post.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaArrowLeft, FaShare, FaTag, FaRegCalendarAlt } from "react-icons/fa";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import useAllPosts from "../hooks/useAllPosts";

function Post() {
  const { lang, slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { posts: allPosts, loading: allPostsLoading } = useAllPosts(lang);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

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

  // 관련글(같은 카테고리 최신글 2개)
  useEffect(() => {
    async function fetchRelated() {
      if (!post || !post.category) return setRelatedPosts([]);
      const q = query(
        collection(db, "posts"),
        where("lang", "==", lang),
        where("category", "==", post.category),
        where("slug", "!=", slug)
      );
      const snap = await getDocs(q);
      const rel = snap.docs.map(doc => doc.data()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setRelatedPosts(rel.slice(0, 2));
    }
    fetchRelated();
  }, [post, lang, slug]);

  // 이전/다음 글 설정
  useEffect(() => {
    if (!post || !allPosts || allPosts.length === 0) {
      setPrevPost(null);
      setNextPost(null);
      return;
    }
    const sorted = [...allPosts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const idx = sorted.findIndex(p => p.slug === slug);
    setPrevPost(idx < sorted.length - 1 ? sorted[idx + 1] : null);
    setNextPost(idx > 0 ? sorted[idx - 1] : null);
  }, [allPosts, post, slug]);

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
        {post.imageUrl && (
          <div className="w-full flex justify-center mb-8">
            <img
              src={post.imageUrl}
              alt={post.title || post.slug}
              className="rounded-xl max-h-80 object-cover shadow-lg border border-purple-200 dark:border-purple-700"
              style={{ width: "100%", maxWidth: 600 }}
            />
          </div>
        )}
        {/* 부가 정보: 카테고리, 날짜만 표시 (저자/태그 제거) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm flex-wrap">
            {post.category && (
              <span className="flex items-center gap-2">
                <FaTag />
                {post.category}
              </span>
            )}
            {post.date && (
              <span className="flex items-center gap-2">
                <FaRegCalendarAlt />
                {post.date}
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
          className="text-lg leading-relaxed break-words prose prose-purple dark:prose-invert dark:text-gray-100 dark:prose-headings:text-gray-100 dark:prose-strong:text-gray-100 dark:prose-a:text-purple-300 dark:prose-blockquote:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* 이전/다음 글 네비게이션 */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mt-12 border-t pt-8 border-purple-200 dark:border-purple-800">
          {prevPost ? (
            <Link
              to={`/post/${prevPost.lang}/${prevPost.slug}`}
              className="flex-1 text-center px-4 py-3 font-semibold rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-150 flex items-center justify-center gap-2"
              style={{ minHeight: 56 }}
            >
              <span className="text-lg">←</span>
              <span className="block text-base md:text-lg text-left">{prevPost.title}</span>
            </Link>
          ) : <div className="flex-1" />}
          {nextPost ? (
            <Link
              to={`/post/${nextPost.lang}/${nextPost.slug}`}
              className="flex-1 text-center px-4 py-3 font-semibold rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-800 transition-all duration-150 flex items-center justify-center gap-2"
              style={{ minHeight: 56 }}
            >
              <span className="block text-base md:text-lg text-right">{nextPost.title}</span>
              <span className="text-lg">→</span>
            </Link>
          ) : <div className="flex-1" />}
        </div>
        {/* 관련글 */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 border-t pt-8 border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">{t('common.relatedPosts') || 'Related Posts'}</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {relatedPosts.map(rp => (
                <Link
                  key={rp.slug}
                  to={`/post/${rp.lang}/${rp.slug}`}
                  className="flex-1 bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-800 rounded-xl shadow hover:shadow-lg p-4 transition-all"
                >
                  <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{rp.title}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{rp.excerpt || rp.description || ''}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Post;
