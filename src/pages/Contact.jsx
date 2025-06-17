import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4">{t('nav.contact')}</h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
        문의 사항이나 제안이 있으시면 아래 이메일로 연락해 주세요.<br />
        <b>fortune.teller.blog@gmail.com</b>
      </p>
      <form className="space-y-4">
        <input type="text" placeholder="이름" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input type="email" placeholder="이메일" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <textarea placeholder="문의 내용" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" rows={5}></textarea>
        <button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">보내기</button>
      </form>
    </div>
  );
};

export default Contact; 