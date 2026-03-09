import { useState, useEffect, useRef } from 'react';

const TAG_COLORS = ['tag-0','tag-1','tag-2','tag-3','tag-4','tag-5','tag-6'];

export default function SnippetCard({ snippet, onCopy, onFavorite, onEdit, onDelete, onTagClick }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current && window.hljs) {
      const block = codeRef.current.querySelector('code');
      if (block) {
        block.removeAttribute('data-highlighted');
        window.hljs.highlightElement(block);
      }
    }
  }, [snippet.code, snippet.language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    onCopy(snippet._id);
    setTimeout(() => setCopied(false), 1500);
  };

  const langMap = {
    javascript: 'JS', typescript: 'TS', python: 'PY', html: 'HTML',
    css: 'CSS', java: 'JAVA', go: 'GO', rust: 'RS', ruby: 'RB',
    bash: 'SH', yaml: 'YML', json: 'JSON', sql: 'SQL', php: 'PHP',
    swift: 'SW', kotlin: 'KT', csharp: 'C#', cpp: 'C++',
  };

  return (
    <div className="snippet-card">
      <div className="snippet-card-header">
        <div style={{ flex: 1 }}>
          <div className="snippet-title">{snippet.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="lang-badge">{langMap[snippet.language] || snippet.language}</span>
          <button
            className={`fav-btn ${snippet.isFavorite ? 'active' : ''}`}
            onClick={() => onFavorite(snippet._id)}
            title={snippet.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            {snippet.isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      {snippet.description && (
        <div className="snippet-desc">{snippet.description}</div>
      )}

      <div className="snippet-code-wrap" ref={codeRef}>
        <pre><code className={`language-${snippet.language}`}>{snippet.code}</code></pre>
      </div>

      <div className="snippet-footer">
        <div className="snippet-tags">
          {(snippet.tags || []).map((tag, i) => (
            <span key={tag} className={`tag ${TAG_COLORS[i % TAG_COLORS.length]}`}
              onClick={() => onTagClick?.(tag)}>
              {tag}
            </span>
          ))}
        </div>
        <div className="snippet-actions" style={{ opacity: 1 }}>
          <button className="btn-ghost btn btn-xs" onClick={() => onEdit(snippet)}
            title="Edit">&#9998;</button>
          <button className="btn-danger btn btn-xs" onClick={() => onDelete(snippet._id)}
            title="Delete">&#128465;</button>
          <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? '\u2713 Copied' : '\u2398 Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
