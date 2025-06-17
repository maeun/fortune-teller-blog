// src/pages/Post.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaShare, FaStar, FaTag } from 'react-icons/fa';

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
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = Object.keys(markdownFiles).find((path) =>
      path.includes(`/posts/${lang}/${slug}.md`)
    );

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
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-16"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-2 transition-colors"
        >
          <FaArrowLeft /> {t('back') || 'Back'}
        </button>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {metadata.title && (
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {metadata.title}
            </h1>
          )}
          
          {metadata.description && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {metadata.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
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
            <button
              onClick={() => sharePost(metadata.title, window.location.href)}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <FaShare /> Share
            </button>
          </div>

          <div
            className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-700 dark:hover:prose-a:text-purple-300"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </article>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
          >
            <FaStar /> {t('backToHome') || 'Back to Home'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Post;
