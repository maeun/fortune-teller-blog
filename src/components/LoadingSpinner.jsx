import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 dark:border-purple-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-gray-600 dark:text-gray-400"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 