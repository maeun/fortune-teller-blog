import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-4">{t('nav.about')}</h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
        포춘텔러 블로그는 무료 운세, 사주, 타로, 궁합, 꿈해몽 등 다양한 운세 서비스를 제공하는 공간입니다.<br />
        여러분의 미래와 운명을 함께 탐구하고, 삶의 방향성을 제시해 드립니다.<br />
        <br />
        <b>운세는 참고용입니다. 긍정적인 마음으로 즐겨주세요!</b>
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-8">
        &copy; 2025 포춘텔러 블로그
      </p>
    </div>
  );
};

export default About; 