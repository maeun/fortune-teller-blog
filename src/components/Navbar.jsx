import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ isDarkMode, toggleDarkMode, isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            🔮 {t('nav.brand')}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => i18n.changeLanguage('ko')}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'ko'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                🇰🇷
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'en'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                🇺🇸
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <FaBars className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => i18n.changeLanguage('ko')}
                    className={`px-2 py-1 rounded ${
                      i18n.language === 'ko'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    🇰🇷
                  </button>
                  <button
                    onClick={() => i18n.changeLanguage('en')}
                    className={`px-2 py-1 rounded ${
                      i18n.language === 'en'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    🇺🇸
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? (
                      <FaSun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <FaMoon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 