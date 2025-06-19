import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/about', label: t('nav.about') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/privacy', label: t('footer.privacy') },
    { path: '/terms', label: t('footer.terms') },
  ];

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/fortune-teller-blog', label: 'GitHub (fortune-teller-blog)' },
    { icon: FaTwitter, url: 'https://twitter.com/fortune_teller_blog', label: 'Twitter (fortune_teller_blog)' },
    { icon: FaInstagram, url: 'https://instagram.com/fortune.teller.blog', label: 'Instagram (fortune.teller.blog)' },
    { icon: FaEnvelope, url: 'mailto:contact@fortuneteller.com', label: 'Email (contact@fortuneteller.com)' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 w-full">
      <div className="w-full px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x md:divide-gray-200 dark:md:divide-gray-700">
          {/* Brand Section */}
          <div className="space-y-4 pb-8 md:pb-0 md:pr-8">
            <Link
              to="/"
              className="text-2xl font-bold text-purple-600 dark:text-purple-400"
            >
              🔮 {t('nav.brand')}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  aria-label={`Visit our ${social.label}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:px-8 pb-8 md:pb-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:px-8 pb-8 md:pb-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.categories')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/fortune"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('categories.fortune')}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/tarot"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('categories.tarot')}
                </Link>
              </li>
              <li>
                <Link
                  to="/category/dreams"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('categories.dreams')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:pl-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.newsletter')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t('footer.newsletterDescription')}
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} {t('nav.brand')}. {t('footer.rights')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 