import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { snippets as api } from '../services/api';
import SnippetCard from '../components/SnippetCard';
import SnippetEditor from '../components/SnippetEditor';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeLang, setActiveLang] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [editor, setEditor] = useState(null); // null = closed, {} = new, {_id:...} = edit
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  const debouncedSearch = useDebounce(search, 300);

  // Load data
  const loadSnippets = useCallback(async () => {
    try {
      let data;
      if (debouncedSearch.trim()) {
        data = await api.search({ q: debouncedSearch, tag: activeTag, lang: activeLang });
      } else {
        const params = {};
        if (activeTag) params.tag = activeTag;
        if (activeLang) params.lang = activeLang;
        if (showFavs) params.fav = 'true';
        data = await api.getAll(params);
      }
      setItems(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [debouncedSearch, activeTag, activeLang, showFavs]);

  const loadMeta = useCallback(async () => {
    try {
      const [t, l, s] = await Promise.all([api.getTags(), api.getLanguages(), api.getStats()]);
      setTags(t); setLanguages(l); setStats(s);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadSnippets(); }, [loadSnippets]);
  useEffect(() => { loadMeta(); }, [loadMeta]);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && editor) setEditor(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editor]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async (form, id) => {
    try {
      if (id) {
        await api.update(id, form);
        showToast('Snippet updated!');
      } else {
        await api.create(form);
        showToast('Snippet saved!');
      }
      setEditor(null);
      loadSnippets();
      loadMeta();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this snippet?')) return;
    try {
      await api.delete(id);
      showToast('Snippet deleted');
      loadSnippets();
      loadMeta();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleFavorite = async (id) => {
    try {
      await api.toggleFav(id);
      loadSnippets();
      loadMeta();
    } catch { /* ignore */ }
  };

  const handleCopy = async (id) => {
    try { await api.trackCopy(id); loadMeta(); } catch { /* ignore */ }
    showToast('Copied to clipboard!');
  };

  const clearFilters = () => {
    setActiveTag(''); setActiveLang(''); setShowFavs(false); setSearch('');
  };

  const hasFilters = activeTag || activeLang || showFavs || search;

  return (
    <div className="app-layout">
      {/* ═══ SIDEBAR ═══ */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
       <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="icon">✂️</span>
            Snip<span className="mint">Stash</span>
          </div>
          <button className="btn btn-mint" onClick={() => setEditor({})}
            style={{ width: '100%', marginTop: '14px', padding: '10px' }}>
            + New Snippet
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Main nav */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Library</div>
            <button className={`sidebar-item ${!hasFilters ? 'active' : ''}`}
              onClick={clearFilters}>
              <span>&#128196;</span> All Snippets
              <span className="count">{stats.totalSnippets || 0}</span>
            </button>
            <button className={`sidebar-item ${showFavs ? 'active' : ''}`}
              onClick={() => { setShowFavs(!showFavs); setActiveTag(''); setActiveLang(''); }}>
              <span>❤️</span> Favorites
              <span className="count">{stats.favorites || 0}</span>
            </button>
          </div>

          {/* Languages */}
          {languages.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Languages</div>
              {languages.map(l => (
                <button key={l.name}
                  className={`sidebar-item ${activeLang === l.name ? 'active' : ''}`}
                  onClick={() => { setActiveLang(activeLang === l.name ? '' : l.name); setShowFavs(false); }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                    background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px', minWidth: '28px', textAlign: 'center' }}>
                    {l.name.slice(0, 2).toUpperCase()}
                  </span>
                  {l.name}
                  <span className="count">{l.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Tags</div>
              {tags.slice(0, 15).map(t => (
                <button key={t.name}
                  className={`sidebar-item ${activeTag === t.name ? 'active' : ''}`}
                  onClick={() => { setActiveTag(activeTag === t.name ? '' : t.name); setShowFavs(false); }}>
                  <span style={{ color: 'var(--mint)', fontSize: '12px' }}>#</span>
                  {t.name}
                  <span className="count">{t.count}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.username}</span>
          <button className="btn btn-ghost btn-xs" onClick={logout}>Sign out</button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input ref={searchRef} className="search-input" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search snippets by title, tags, description, or code..." />
            <span className="search-kbd">Ctrl+K</span>
          </div>

          <div className="topbar-stats">
            <div className="topbar-stat">
              <span className="value">{stats.totalSnippets || 0}</span> snippets
            </div>
            <div className="topbar-stat">
              <span className="value">{stats.languages || 0}</span> languages
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content-area">
          {/* Active filters indicator */}
          {hasFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Filtered by:</span>
              {search && <span className="tag tag-0">search: "{search}"</span>}
              {activeTag && <span className="tag tag-1">#{activeTag}</span>}
              {activeLang && <span className="tag tag-2">{activeLang}</span>}
              {showFavs && <span className="tag tag-6">&#9829; favorites</span>}
              <button className="btn btn-ghost btn-xs" onClick={clearFilters}>Clear all</button>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">&#9203;</div>
              <h3>Loading your snippets...</h3>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">{search ? '🔍' : '✂️'}</div>
              <h3>{search ? 'No matches found' : 'Your library is empty'}</h3>
              <p>{search
                ? 'Try different keywords. SnipStash searches titles (10x weight), tags (8x), descriptions (5x), and code (1x).'
                : 'Save your first code snippet and build your personal library.'
              }</p>
              {!search && (
                <button className="btn btn-mint" onClick={() => setEditor({})}>
                  + Create Your First Snippet
                </button>
              )}
            </div>
          ) : (
            <div className="snippet-grid">
              {items.map(s => (
                <SnippetCard key={s._id} snippet={s}
                  onCopy={handleCopy}
                  onFavorite={handleFavorite}
                  onEdit={setEditor}
                  onDelete={handleDelete}
                  onTagClick={(tag) => { setActiveTag(tag); setShowFavs(false); }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {editor !== null && (
        <SnippetEditor snippet={editor} onSave={handleSave} onClose={() => setEditor(null)} />
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
