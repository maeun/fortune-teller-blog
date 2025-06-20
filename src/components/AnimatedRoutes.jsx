import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from './Loading';

// Lazy load pages
const Home = lazy(() => import('../pages/Home'));
const Blog = lazy(() => import('../pages/Blog'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Post = lazy(() => import('../pages/Post'));

const PageWrapper = ({ children }) => {
  const variants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const NotFound = () => (
  <PageWrapper>
    <div className="text-center py-20 text-gray-500 dark:text-gray-300">
      <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  </PageWrapper>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<Loading />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/post/:lang/:slug" element={<PageWrapper><Post /></PageWrapper>} />
          <Route path="/post/:slug" element={<PageWrapper><Post /></PageWrapper>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AnimatedRoutes;