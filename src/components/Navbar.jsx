import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ isMenuOpen, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-purple-200 dark:border-purple-700'
          : 'bg-white/90 dark:bg-gray-900/90 border-b border-purple-100 dark:border-purple-800'
      }`}
    >
      <div className="w-full px-4 md:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
          >
            🔮 {t('nav.brand')}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 md:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-semibold transition-colors ${
                  location.pathname === link.path
                    ? 'text-purple-700 dark:text-purple-300 underline underline-offset-4'
                    : 'text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label="Switch to English"
              >
                🇺🇸 EN
              </button>
              <button
                onClick={() => i18n.changeLanguage('tr')}
                className={`px-2 py-1 rounded ${i18n.language === 'tr' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label="Switch to Turkish"
              >
                🇹🇷 TR
              </button>
              <button
                onClick={() => i18n.changeLanguage('ja')}
                className={`px-2 py-1 rounded ${i18n.language === 'ja' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label="Switch to Japanese"
              >
                🇯🇵 JP
              </button>
              <button
                onClick={() => i18n.changeLanguage('zh')}
                className={`px-2 py-1 rounded ${i18n.language === 'zh' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-label="Switch to Chinese"
              >
                🇨🇳 CN
              </button>
            </div>
            {/* Mobile Language Switcher (Dropdown) */}
            <div className="md:hidden ml-2">
              <select
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
                className="block w-20 text-sm rounded bg-purple-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-purple-200 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Select language"
              >
                <option value="en">🇺🇸 EN</option>
                <option value="tr">🇹🇷 TR</option>
                <option value="ja">🇯🇵 JP</option>
                <option value="zh">🇨🇳 CN</option>
              </select>
            </div>
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
            ref={menuRef}
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
                    className={`text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Mobile Language Switcher (Dropdown) */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <select
                    value={i18n.language}
                    onChange={e => i18n.changeLanguage(e.target.value)}
                    className="block w-full text-base rounded bg-purple-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-purple-200 dark:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label="Select language"
                  >
                    <option value="en">🇺🇸 EN</option>
                    <option value="tr">🇹🇷 TR</option>
                    <option value="ja">🇯🇵 JP</option>
                    <option value="zh">🇨🇳 CN</option>
                  </select>
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