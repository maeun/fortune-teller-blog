import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTag } from 'react-icons/fa';
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
                  className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0"
                >
                  <Link to={`/post/${post.lang}/${post.slug}`} className="block group">
                    {post.imageUrl && (
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
                        <LazyLoadImage
                          src={post.imageUrl}
                          alt={post.title || post.slug}
                          effect="blur"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.category && (
                          <span className="flex items-center">
                            <FaTag className="mr-2" />
                            {post.category}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {post.title || post.slug}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {post.excerpt || post.description || ''}
                      </p>
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