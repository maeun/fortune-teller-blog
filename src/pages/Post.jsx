// src/pages/Post.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { ArrowLeft, Calendar, Clock, Share2, Star } from 'lucide-react';

const markdownFiles = import.meta.glob('../posts/*/*.md', { as: 'raw' });

const parseMetadata = (content) => {
  const metaMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!metaMatch) return { content, metadata: {} };

  const metaString = metaMatch[1];
  const metadata = {};

  metaString.split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length > 0) {
      metadata[key.trim()] = rest.join(':').trim();
    }
  });

  const mainContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  return { content: mainContent, metadata };
};

const calculateReadingTime = (text) => {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const sharePost = async (title, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      console.log('Share error:', err);
    }
  } else {
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
  const [readingTime, setReadingTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = Object.keys(markdownFiles).find((path) =>
      path.includes(`/posts/${lang}/${slug}.md`)
    );

    if (!key) {
      setContent('# 404\n\nThis post could not be found.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const raw = await markdownFiles[key]();
        const { content: parsed, metadata: meta } = parseMetadata(raw);
        setContent(parsed);
        setMetadata(meta);
        setReadingTime(calculateReadingTime(parsed));
      } catch (e) {
        setContent('# Error\n\nFailed to load content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lang, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-4xl animate-spin">🔮</div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-purple-100">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-purple-300 hover:text-white flex items-center gap-2">
          <ArrowLeft size={18} /> {t('back') || 'Back'}
        </button>

        {metadata.title && (
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{metadata.title}</h1>
        )}
        {metadata.description && (
          <p className="text-purple-300 mb-4">{metadata.description}</p>
        )}

        <div className="flex items-center gap-6 text-purple-400 text-sm mb-6">
          {metadata.date && (
            <span className="flex items-center gap-1"><Calendar size={14} />{metadata.date}</span>
          )}
          <span className="flex items-center gap-1"><Clock size={14} />{readingTime} min read</span>
          <button onClick={() => sharePost(metadata.title, window.location.href)} className="flex items-center gap-1 hover:text-purple-200 transition">
            <Share2 size={14} /> Share
          </button>
        </div>

        <div
          className="prose prose-invert max-w-none prose-p:text-purple-200 prose-headings:text-purple-100 prose-a:text-purple-300 hover:prose-a:text-white"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow transition"
        >
          <Star size={16} /> {t('backToHome') || 'Back to Home'}
        </button>
      </div>
    </div>
  );
}

export default Post;
