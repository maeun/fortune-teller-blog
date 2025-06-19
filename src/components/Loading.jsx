import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="relative w-20 h-20 mb-4">
          <motion.div
            className="absolute inset-0 border-4 border-purple-200 dark:border-purple-900 rounded-full"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-t-purple-600 dark:border-t-purple-400 rounded-full"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔮</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          {t('common.loading')}
        </p>
      </motion.div>
    </div>
  );
};

export default Loading; 