// src/pages/Post.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaShare, FaStar, FaTag } from 'react-icons/fa';

// glob 경로를 상대경로로 복원
const markdownFiles = import.meta.glob('../posts/*/*.md', { as: 'raw' });

const parseMetadata = (content) => {
  const metaMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!metaMatch) return { content, metadata: {} };

  const metaString = metaMatch[1];
  const metadata = {};

  metaString.split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length > 0) {
      metadata[key.trim()] = rest.join(':').trim();
    }
  });

  const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { content: mainContent, metadata };
};

const calculateReadingTime = (text) => {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const sharePost = async (title, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      console.log('Share error:', err);
    }
  } else {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
};

function Post() {
  const { lang: urlLang, slug } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = urlLang;

  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // 언어 변경 시 URL도 동기화
  useEffect(() => {
    if (i18n.language !== lang) {
      // 해당 언어/slug 파일이 있으면 이동
      const key = Object.keys(markdownFiles).find((path) =>
        path.includes(`/posts/${i18n.language}/${slug}.md`)
      );
      if (key) {
        navigate(`/post/${i18n.language}/${slug}`, { replace: true });
        return;
      }
    }
  }, [i18n.language, lang, slug, navigate]);

  useEffect(() => {
    // 디버깅: 현재 lang, slug, 모든 key 출력
    console.log('Post page params:', { lang, slug });
    console.log('Available markdown keys:', Object.keys(markdownFiles));
    // lang과 slug로 정확히 매칭 (경로가 정확히 끝나는지 확인)
    const key = Object.keys(markdownFiles).find((path) =>
      path.endsWith(`/posts/${lang}/${slug}.md`)
    );
    console.log('Matched key:', key);
    if (!key) {
      setContent('# 404\n\nThis post could not be found.');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const raw = await markdownFiles[key]();
        const { content: parsed, metadata: meta } = parseMetadata(raw);
        setContent(parsed);
        setMetadata(meta);
        setReadingTime(calculateReadingTime(parsed));
      } catch (e) {
        setContent('# Error\n\nFailed to load content.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">🔮</div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{t('loading')}</p>
        </motion.div>
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
          <FaArrowLeft /> {t('back') || 'Back'}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-4 md:p-10 mx-auto relative border border-purple-100 dark:border-purple-800"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm flex-wrap">
            {metadata.date && (
              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                {metadata.date}
              </span>
            )}
            <span className="flex items-center gap-2">
              <FaClock />
              {readingTime} min read
            </span>
            {metadata.category && (
              <span className="flex items-center gap-2">
                <FaTag />
                {metadata.category}
              </span>
            )}
          </div>
          <button
            onClick={() => sharePost(metadata.title, window.location.href)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 font-semibold rounded-full shadow hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
          >
            <FaShare /> {t('share') || 'Share'}
          </button>
        </div>
        {metadata.title && (
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-purple-800 dark:text-purple-200 mb-6 leading-tight">
            {metadata.title}
          </h1>
        )}
        {metadata.description && (
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {metadata.description}
          </p>
        )}
        <div
          className="text-white text-lg leading-relaxed break-words
            [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:mb-6
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3
            [&_p]:mb-5 [&_ul]:mb-5 [&_ol]:mb-5
            [&_li]:ml-6 [&_li]:mb-2
            [&_strong]:text-purple-200
            [&_a]:text-purple-300 hover:[&_a]:text-purple-100 underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-purple-700 [&_blockquote]:pl-4 [&_blockquote]:text-white [&_blockquote]:italic [&_blockquote]:mb-5
            [&_code]:bg-gray-800 [&_code]:text-purple-200 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded
            [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
            [&_hr]:my-8 [&_hr]:border-purple-700
            "
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
        {/* Feedback Section */}
        <div className="mt-12 text-center">
          {feedbackSubmitted ? (
            <p className="text-green-600 dark:text-green-400 font-medium">{t('common.thankYouForFeedback') || 'Thank you for your feedback!'}</p>
          ) : (
            <>
              <p className="mb-2 text-gray-700 dark:text-gray-300">{t('common.wasThisHelpful') || 'Was this post helpful?'}</p>
              <button
                onClick={() => { setFeedback('yes'); setFeedbackSubmitted(true); }}
                className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full mr-2 transition-colors"
                aria-label="Yes, this was helpful"
              >
                {t('common.yes') || 'Yes'}
              </button>
              <button
                onClick={() => { setFeedback('no'); setFeedbackSubmitted(true); }}
                className="inline-block px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full transition-colors"
                aria-label="No, this was not helpful"
              >
                {t('common.no') || 'No'}
              </button>
            </>
          )}
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors text-lg font-semibold"
          >
            <FaStar /> {t('backToHome') || 'Back to Home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Post;
