import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full px-4 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-6">
          About Fortune Teller Blog
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Welcome to Fortune Teller Blog, your trusted source for free fortune telling services and mystical insights. 
            Our mission is to provide accurate, insightful, and accessible fortune telling services to help you navigate life's journey.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Our Services
          </h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <FaStar className="text-yellow-400 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Tarot Reading</h3>
                <p className="text-gray-600 dark:text-gray-400">Get personalized insights through our comprehensive tarot card readings.</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-400 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dream Interpretation</h3>
                <p className="text-gray-600 dark:text-gray-400">Understand the hidden meanings in your dreams with our expert interpretations.</p>
              </div>
            </li>
            <li className="flex items-start">
              <FaStar className="text-yellow-400 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Daily Horoscope</h3>
                <p className="text-gray-600 dark:text-gray-400">Check your daily horoscope for guidance and insights into your day.</p>
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We are committed to providing accurate and insightful fortune telling services while maintaining the highest standards of professionalism and ethics. 
            Our readings are meant to guide and inspire, not to predict the future with absolute certainty.
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mt-8">
            <p className="text-purple-800 dark:text-purple-300 italic">
              "Fortune telling is an art that combines intuition, wisdom, and guidance. 
              Our goal is to help you find clarity and direction in your life's journey."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About; 