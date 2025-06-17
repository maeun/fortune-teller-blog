import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const posts = [
  {
    id: 1,
    title: 'Understanding Your Daily Horoscope',
    excerpt: 'Learn how to interpret your daily horoscope and use it to guide your decisions.',
    category: 'Horoscope',
    date: '2024-03-20',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Tarot Card Reading Guide for Beginners',
    excerpt: 'A comprehensive guide to understanding and reading tarot cards for beginners.',
    category: 'Tarot',
    date: '2024-03-19',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Dream Interpretation: Common Symbols',
    excerpt: 'Discover the meaning behind common dream symbols and what they reveal about your subconscious.',
    category: 'Dreams',
    date: '2024-03-18',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
  },
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1920&auto=format&fit=crop&q=60"
            alt="Fortune telling background"
            effect="blur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            {t('home.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/blog"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
            >
              {t('home.hero.cta')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">
            {t('common.latestPosts')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link to={`/post/${post.id}`}>
                  <div className="relative h-48">
                    <LazyLoadImage
                      src={post.image}
                      alt={post.title}
                      effect="blur"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-purple-600 dark:text-purple-400">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaRegCalendarAlt />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaRegClock />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {t('common.readMore')}
                      </span>
                      <FaStar className="text-yellow-400" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
