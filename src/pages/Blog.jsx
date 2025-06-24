import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTag, FaUser } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import useFirestorePosts from '../hooks/useFirestorePosts';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { posts, loading } = useFirestorePosts(lang);

  return (
    <div className="w-full px-4 md:px-8 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-8">
            Fortune Telling Blog
          </h1>

          <div className="grid gap-8">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">{t('common.noResults') || 'No posts found.'}</div>
            ) : (
              posts.map((post, index) => (
                <motion.article
                  key={post.slug + '-' + post.lang}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border border-gray-200 dark:border-purple-800 bg-white dark:bg-gray-950 shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow flex flex-col md:flex-row overflow-hidden"
                >
                  <Link to={`/post/${post.lang}/${post.slug}`} className="flex flex-1 flex-col md:flex-row group">
                    {/* 이미지 (좌측, 데스크탑에서만 보임) */}
                    {post.imageUrl && (
                      <div className="md:w-56 w-full h-48 md:h-auto flex-shrink-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        <LazyLoadImage
                          src={post.imageUrl}
                          alt={post.title || post.slug}
                          effect="blur"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    {/* 텍스트 영역 */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                        {post.title || post.slug}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-200 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4">
                        {post.excerpt || post.description || ''}
                      </p>
                      {/* 부가 정보: 카테고리, 날짜만 표시 (저자/태그 제거) */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-purple-300 mt-auto pt-2 border-t border-purple-100 dark:border-purple-800">
                        {post.category && (
                          <span className="flex items-center gap-1"><FaTag />{post.category}</span>
                        )}
                        {post.date && (
                          <span className="flex items-center gap-1"><FaRegCalendarAlt />{post.date}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;