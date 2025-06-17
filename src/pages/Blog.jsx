import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    title: '2025년 무료 신년 운세 총정리',
    excerpt: '2025년을 맞이하여 무료로 볼 수 있는 신년 운세, 사주, 타로, 궁합, 꿈해몽 등 다양한 운세 서비스를 소개합니다.',
    category: '운세',
  },
  {
    id: 2,
    title: '타로카드로 알아보는 오늘의 운세',
    excerpt: '타로카드를 통해 오늘의 운세를 쉽고 재미있게 확인해보세요.',
    category: '타로',
  },
  {
    id: 3,
    title: '꿈해몽으로 알아보는 나의 심리',
    excerpt: '꿈에서 본 상징들을 해석하여 내면의 심리를 알아보는 방법을 안내합니다.',
    category: '꿈해몽',
  },
];

const Blog = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-6">{t('nav.blog')}</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <Link to={`/post/${post.id}`} className="block group">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">{post.excerpt}</p>
              <span className="inline-block text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded px-2 py-1 mt-1">{post.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog; 