import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaTag } from 'react-icons/fa';

// 모든 마크다운 파일을 동적으로 import
const markdownFiles = import.meta.glob('../posts/*/*.md', { as: 'raw' });

// 마크다운에서 메타데이터 추출
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

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const lang = i18n.language;

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      const langPriority = [lang, 'en', 'tr', 'ja', 'zh', 'ko'];
      const allPosts = [];
      for (const path in markdownFiles) {
        // path 예시: '../posts/en/ai-and-destiny.md'
        const match = path.match(/\.\.\/posts\/(\w+)\/(.+)\.md$/);
        if (!match) continue;
        const fileLang = match[1];
        const slug = match[2];
        try {
          const raw = await markdownFiles[path]();
          const { metadata } = parseMetadata(raw);
          allPosts.push({
            slug,
            lang: fileLang,
            ...metadata,
          });
        } catch (e) {
          // 무시
        }
      }
      // 언어 우선순위에 따라 정렬 및 필터링
      const filtered = [];
      const usedSlugs = new Set();
      for (const l of langPriority) {
        allPosts.forEach((post) => {
          if (post.lang === l && !usedSlugs.has(post.slug)) {
            filtered.push(post);
            usedSlugs.add(post.slug);
          }
        });
      }
      // 날짜 내림차순 정렬 (metadata.date가 있을 경우)
      filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      if (isMounted) setPosts(filtered);
    };
    fetchPosts();
    return () => { isMounted = false; };
  }, [lang]);

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
            {posts.length === 0 ? (
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
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.date && (
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            {post.date}
                          </span>
                        )}
                        {post.readTime && (
                          <span className="flex items-center">
                            <FaClock className="mr-2" />
                            {post.readTime}
                          </span>
                        )}
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