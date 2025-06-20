import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import useFirestorePosts from '../hooks/useFirestorePosts';

// 마크다운 파일 동적 import
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
  return { content: content.replace(/^---\n[\s\S]*?\n---\n/, ''), metadata };
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { posts: latestPosts, loading } = useFirestorePosts(lang);

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      const allPosts = [];
      for (const path in markdownFiles) {
        const match = path.match(/\.\.\/posts\/(\w+)\/(.+)\.md$/);
        if (!match) continue;
        const fileLang = match[1];
        const slug = match[2];
        if (fileLang !== lang) continue;
        try {
          const raw = await markdownFiles[path]();
          const { metadata } = parseMetadata(raw);
          allPosts.push({
            slug,
            lang: fileLang,
            ...metadata,
          });
        } catch (e) {}
      }
      allPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      if (isMounted) setLatestPosts(allPosts.slice(0, 3));
    };
    fetchPosts();
    return () => { isMounted = false; };
  }, [lang]);

  const popularPostId = 1; // 예시: 첫 번째 글만 인기글로 표시

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden w-full px-4 md:px-8">
        <div className="absolute inset-0 z-0 w-full h-full">
          <LazyLoadImage
            src="/images/blog/hero.jpg"
            alt="Fortune telling background"
            effect="blur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative z-10 text-center w-full px-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
          >
            {t('home.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-x-4"
          >
            <Link
              to="/blog"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors"
            >
              {t('home.hero.cta')}
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors backdrop-blur-sm"
            >
              {t('nav.about')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 w-full px-4 md:px-8">
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(t('home.features', { returnObjects: true }))
              .filter(([key]) => key !== 'title')
              .map(([key, feature], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12 md:py-16 w-full px-4 md:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('common.latestPosts')}
          </h2>
          <div className="border-b-2 border-purple-200 dark:border-purple-700 mb-8 md:mb-12 w-24" />
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
          ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.slice(0, 3).map((post, index) => (
              <motion.article
                key={post.slug + '-' + post.lang}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 group"
                whileHover={{ scale: 1.03 }}
              >
                <Link to={`/post/${post.lang}/${post.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {post.category && (
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 rounded px-2 py-1">
                          {post.category}
                        </span>
                      )}
                      {post.date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <FaRegCalendarAlt />
                          <span>{post.date}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white flex items-center">
                      {post.title || post.slug}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      {post.excerpt || post.description || ''}
                    </p>
                    <div className="flex justify-end">
                      <span
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-full font-semibold text-sm shadow hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        tabIndex={-1}
                      >
                        {t('common.readMore')}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
          )}
          <div className="flex justify-center mt-10">
            <Link
              to="/blog"
              className="inline-block px-8 py-3 bg-white dark:bg-gray-900 border border-purple-600 dark:border-purple-400 text-purple-700 dark:text-purple-300 font-bold rounded-full shadow hover:bg-purple-50 dark:hover:bg-purple-800 hover:text-purple-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {t('common.seeMore') || 'See More'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
