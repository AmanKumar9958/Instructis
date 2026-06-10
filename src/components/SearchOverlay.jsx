import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import examData from '../data/examData';
import categoryData from '../data/categoryData';

/**
 * Global search overlay.
 * Opened via Ctrl+K / Cmd+K or search button in navbar.
 * Searches across exams, categories, and pages.
 */
export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Searchable items
  const searchItems = useMemo(() => {
    const items = [];

    // Exams
    examData.forEach(exam => {
      items.push({
        type: 'Exam',
        title: exam.name,
        subtitle: `${exam.category} • ${exam.subjects.join(', ')}`,
        link: `/competitive-exams/${exam.slug}`,
        tags: [exam.shortName, exam.name, exam.category, ...exam.subjects].join(' ')
      });
    });

    // Categories
    categoryData.forEach(cat => {
      items.push({
        type: 'Category',
        title: cat.title,
        subtitle: cat.description,
        link: `/${cat.slug}`,
        tags: [cat.title, cat.description].join(' ')
      });
    });

    // Static pages
    items.push(
      { type: 'Page', title: 'Partner With Us', subtitle: 'Explore partnership opportunities', link: '/partner', tags: 'partner collaboration partnership' },
      { type: 'Page', title: 'About Instructis', subtitle: 'Learn about our mission and team', link: '/about', tags: 'about us team mission' },
      { type: 'Page', title: 'Centers', subtitle: 'Find Instructis centers across India', link: '/centers', tags: 'centers offline locations' },
      { type: 'Page', title: 'AI & Machine Learning', subtitle: 'Master AI/ML with hands-on projects', link: '/ai-ml', tags: 'ai ml machine learning artificial intelligence python' },
      { type: 'Page', title: 'Coding & Programming', subtitle: 'Learn coding, DSA, and web development', link: '/coding', tags: 'coding programming dsa web development javascript python' }
    );

    return items;
  }, []);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchItems.filter(item =>
      item.tags.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, searchItems]);

  const handleResultClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-[fadeIn_200ms_ease]"
        onClick={onClose}
      />

      {/* Search panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-elevated overflow-hidden animate-[scaleIn_200ms_ease]">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exams, courses, topics..."
            className="flex-1 text-base outline-none placeholder-gray-400 bg-transparent"
            autoComplete="off"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="font-medium">No results for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2">
              {results.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={handleResultClick}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple bg-brand-light-purple px-2 py-0.5 rounded-md">
                        {item.type}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm truncate">{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subtitle}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="p-6 text-center text-gray-400 text-sm">
              <p>Search for exams, courses, topics, or pages</p>
              <p className="mt-1 text-xs">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px]">ESC</kbd> to close</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) translateY(-8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  );
}
