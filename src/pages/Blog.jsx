import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaTag } from 'react-icons/fa';

const posts = [
  {
    id: 1,
    title: '2025 New Year Fortune Reading Guide',
    excerpt: 'Discover your path for 2025 with our comprehensive guide to free fortune telling services, including tarot readings, horoscopes, and dream interpretations.',
    category: 'Horoscope',
    date: 'January 1, 2025',
    readTime: '5 min read',
    image: '/images/blog/horoscope.jpg'
  },
  {
    id: 2,
    title: 'Daily Tarot Reading: Your Path to Clarity',
    excerpt: 'Explore your daily guidance through tarot card readings. Learn how to interpret the cards and gain insights into your day ahead.',
    category: 'Tarot',
    date: 'January 2, 2025',
    readTime: '4 min read',
    image: '/images/blog/tarot.jpg'
  },
  {
    id: 3,
    title: 'Understanding Your Dreams: A Complete Guide',
    excerpt: 'Dive deep into the world of dream interpretation. Learn how to decode the symbols in your dreams and understand your subconscious mind.',
    category: 'Dream Interpretation',
    date: 'January 3, 2025',
    readTime: '6 min read',
    image: '/images/blog/dreams.jpg'
  },
];

const Blog = () => {
  const { t } = useTranslation();
  
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
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 last:pb-0"
              >
                <Link to={`/post/${post.id}`} className="block group">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-2" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog; 