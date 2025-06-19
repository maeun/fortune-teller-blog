import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaRegClock, FaRegCalendarAlt, FaMagic, FaComments } from 'react-icons/fa';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-0 md:px-0 py-0">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-16 md:py-24 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-700 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <FaMagic className="text-6xl text-yellow-300 mb-4 drop-shadow-lg animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Fortune Teller Blog
          </h1>
          <p className="text-lg md:text-2xl text-purple-100 max-w-2xl mb-6 font-medium">
            Your trusted source for mystical insights and free fortune telling services.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-12 max-w-4xl mx-auto -mt-16 z-10 relative"
      >
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
            <FaRegClock className="text-purple-400" /> About Us
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Welcome to <span className="font-semibold text-purple-700 dark:text-purple-300">Fortune Teller Blog</span>, your trusted source for free fortune telling services and mystical insights. <br />
            Our mission is to provide accurate, insightful, and accessible fortune telling services to help you navigate life's journey.
          </p>

          {/* Services Section */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-6 flex items-center gap-2">
            <FaRegCalendarAlt className="text-purple-400" /> Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 flex flex-col items-center shadow-md hover:scale-105 transition-transform">
              <FaStar className="text-yellow-400 text-3xl mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Tarot Reading</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Get personalized insights through our comprehensive tarot card readings.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 flex flex-col items-center shadow-md hover:scale-105 transition-transform">
              <FaStar className="text-yellow-400 text-3xl mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Dream Interpretation</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Understand the hidden meanings in your dreams with our expert interpretations.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 flex flex-col items-center shadow-md hover:scale-105 transition-transform">
              <FaStar className="text-yellow-400 text-3xl mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Daily Horoscope</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Check your daily horoscope for guidance and insights into your day.</p>
            </div>
          </div>

          {/* Commitment Section */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
            <FaRegClock className="text-purple-400" /> Our Commitment
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            We are committed to providing accurate and insightful fortune telling services while maintaining the highest standards of professionalism and ethics. <br />
            Our readings are meant to guide and inspire, not to predict the future with absolute certainty.
          </p>

          {/* Quote Section */}
          <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200 dark:from-purple-900 dark:via-purple-800 dark:to-purple-900 rounded-xl p-8 mt-8 shadow-inner flex flex-col items-center">
            <p className="text-purple-800 dark:text-purple-200 italic text-lg text-center max-w-2xl">
              "Fortune telling is an art that combines intuition, wisdom, and guidance. <br />
              Our goal is to help you find clarity and direction in your life's journey."
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center mt-12">
            <a href="/contact" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-colors text-lg">
              <FaComments className="text-xl" /> Contact Us for a Personalized Reading
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">We respond within 24 hours!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;