// src/pages/Post.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  BookOpen,
  Star,
  Moon,
  Sparkles
} from 'lucide-react';

// 🧩 모든 md 파일을 미리 glob import
const markdownFiles = import.meta.glob('../posts/*/*.md', { as: 'raw' });

// 메타데이터 파싱 함수
const parseMetadata = (content) => {
  const metaMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!metaMatch) return { content, metadata: {} };
  
  const metaString = metaMatch[1];
  const metadata = {};
  
  metaString.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { content: mainContent, metadata };
};

// 읽기 시간 계산
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// 공유 기능
const sharePost = async (title, url) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        url: url
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }
};

function Post() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const path = `../posts/${lang}/${slug}.md`;

    const loadContent = async () => {
      setIsLoading(true);
      const file = markdownFiles[path];
      
      if (file) {
        try {
          const text = await file();
          const { content: parsedContent, metadata: parsedMetadata } = parseMetadata(text);
          setContent(parsedContent);
          setMetadata(parsedMetadata);
          setReadingTime(calculateReadingTime(parsedContent));
        } catch (error) {
          console.error('Error loading post:', error);
          setContent(`# Error\n\nFailed to load this post.`);
        }
      } else {
        setContent(`# 404\n\nThis mystical post has vanished into the cosmic void.`);
      }
      
      setIsLoading(false);
    };

    loadContent();
  }, [lang, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin text-4xl sm:text-6xl mb-3 sm:mb-4">🔮</div>
            <p className="text-purple-200 text-base sm:text-lg">Channeling cosmic energies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
      {/* Mystical background elements - responsive positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-4 sm:top-20 sm:left-10 animate-pulse">
          <Star className="text-yellow-300 opacity-30" size={16} sm:size={24} />
        </div>
        <div className="absolute top-32 right-4 sm:top-40 sm:right-20 animate-bounce">
          <Moon className="text-blue-200 opacity-20" size={20} sm:size={32} />
        </div>
        <div className="absolute bottom-24 left-4 sm:bottom-32 sm:left-20 animate-pulse">
          <Sparkles className="text-pink-300 opacity-25" size={18} sm:size={28} />
        </div>
        <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-10 animate-ping">
          <Star className="text-purple-300 opacity-20" size={14} sm:size={20} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header - mobile optimized */}
        <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 sm:gap-2 text-purple-200 hover:text-white transition-colors duration-300 group text-sm sm:text-base touch-manipulation"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" size={18} sm:size={20} />
              <span className="hidden xs:inline">Back to Mystical Realm</span>
              <span className="xs:hidden">Back</span>
            </button>
          </div>
        </header>

        {/* Main Content - mobile optimized */}
        <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Article Header */}
          <div className="mb-6 sm:mb-8">
            {metadata.category && (
              <div className="mb-3 sm:mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  🔮 {metadata.category}
                </span>
              </div>
            )}
            
            {metadata.title && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 leading-tight mb-3 sm:mb-4 break-words">
                {metadata.title}
              </h1>
            )}
            
            {metadata.description && (
              <p className="text-lg sm:text-xl text-purple-100/80 leading-relaxed mb-4 sm:mb-6">
                {metadata.description}
              </p>
            )}

            {/* Meta Information - mobile optimized */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-purple-200/70">
              {metadata.date && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar size={14} sm:size={16} />
                  <span className="hidden sm:inline">{new Date(metadata.date).toLocaleDateString()}</span>
                  <span className="sm:hidden">{new Date(metadata.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock size={14} sm:size={16} />
                <span>{readingTime} min</span>
              </div>
              
              {metadata.author && (
                <div className="flex items-center gap-1.5 sm:gap-2 hidden sm:flex">
                  <BookOpen size={16} />
                  <span>by {metadata.author}</span>
                </div>
              )}
              
              <button
                onClick={() => sharePost(metadata.title || slug, window.location.href)}
                className="flex items-center gap-1.5 sm:gap-2 hover:text-purple-200 transition-colors duration-300 touch-manipulation"
              >
                <Share2 size={14} sm:size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Article Content - mobile optimized */}
          <article className="bg-black/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none
                  prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-200 prose-headings:to-pink-200 prose-headings:break-words
                  prose-p:text-purple-100/90 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base
                  prose-a:text-purple-300 prose-a:no-underline hover:prose-a:text-purple-200 prose-a:transition-colors prose-a:break-words
                  prose-strong:text-purple-200 prose-strong:font-semibold
                  prose-em:text-pink-200 prose-em:italic
                  prose-blockquote:border-l-purple-400 prose-blockquote:bg-purple-900/20 prose-blockquote:text-purple-100 prose-blockquote:mx-0 prose-blockquote:text-sm sm:prose-blockquote:text-base
                  prose-code:text-pink-300 prose-code:bg-purple-900/30 prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:break-words
                  prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-purple-500/30 prose-pre:text-xs sm:prose-pre:text-sm prose-pre:overflow-x-auto
                  prose-ul:text-purple-100/90 prose-ol:text-purple-100/90 prose-ul:text-sm sm:prose-ul:text-base prose-ol:text-sm sm:prose-ol:text-base
                  prose-li:my-1 prose-li:text-sm sm:prose-li:text-base
                  prose-hr:border-purple-500/30
                  prose-table:text-purple-100/90 prose-table:text-xs sm:prose-table:text-sm prose-table:overflow-x-auto prose-table:block sm:prose-table:table
                  prose-th:text-purple-200 prose-th:border-purple-500/30 prose-th:text-xs sm:prose-th:text-sm prose-th:px-2 sm:prose-th:px-4
                  prose-td:border-purple-500/20 prose-td:text-xs sm:prose-td:text-sm prose-td:px-2 sm:prose-td:px-4
                  prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto
                  prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl
                  prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl
                  prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-xl
                  prose-h4:text-sm sm:prose-h4:text-base md:prose-h4:text-lg"
                dangerouslySetInnerHTML={{ __html: marked(content) }} 
              />
            </div>
            
            {/* Mystical decoration at bottom */}
            <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </article>

          {/* Tags - mobile optimized */}
          {metadata.tags && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-xs sm:text-sm font-medium text-purple-200 mb-2 sm:mb-3">Mystical Tags</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {metadata.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 text-xs bg-purple-500/10 text-purple-200 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-colors duration-300 touch-manipulation"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation - mobile optimized */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-500/20">
            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base touch-manipulation"
              >
                <Star size={16} sm:size={18} />
                <span className="hidden xs:inline">Explore More Mysteries</span>
                <span className="xs:hidden">More Mysteries</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Post;