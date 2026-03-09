import { useState, useEffect } from 'react';

const LANGUAGES = [
  'javascript','typescript','python','html','css','java','go','rust',
  'ruby','bash','yaml','json','sql','php','swift','kotlin','csharp','cpp'
];

export default function SnippetEditor({ snippet, onSave, onClose }) {
  const isEdit = !!snippet?._id;
  const [form, setForm] = useState({
    title: '', description: '', code: '', language: 'javascript', tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (snippet) {
      setForm({
        title: snippet.title || '',
        description: snippet.description || '',
        code: snippet.code || '',
        language: snippet.language || 'javascript',
        tags: snippet.tags || [],
      });
    }
  }, [snippet]);

  const addTag = (value) => {
    const tag = value.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      removeTag(form.tags[form.tags.length - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.code.trim()) return;
    setSaving(true);
    await onSave(form, snippet?._id);
    setSaving(false);
  };

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = form.code.substring(0, start) + '  ' + form.code.substring(end);
      setForm({ ...form, code: newCode });
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Snippet' : 'New Snippet'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}
            style={{ fontSize: '20px' }}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="label">Title</label>
              <input className="input" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="React useDebounce Hook" />
            </div>
            <div className="form-group">
              <label className="label">Language</label>
              <select className="input select" value={form.language}
                onChange={e => setForm({...form, language: e.target.value})}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <input className="input" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Brief description of what this snippet does" />
          </div>

          <div className="form-group">
            <label className="label">Code</label>
            <textarea className="input input-code" value={form.code}
              onChange={e => setForm({...form, code: e.target.value})}
              onKeyDown={handleTab}
              placeholder="Paste or type your code here..."
              rows={12} />
          </div>

          <div className="form-group">
            <label className="label">Tags</label>
            <div className="tag-input-wrap">
              {form.tags.map(tag => (
                <span key={tag} className="tag-input-tag">
                  {tag}
                  <button className="tag-input-remove" onClick={() => removeTag(tag)}>&times;</button>
                </span>
              ))}
              <input className="tag-input-field" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder={form.tags.length === 0 ? 'Type and press Enter to add tags' : 'Add more...'} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-surface" onClick={onClose}>Cancel</button>
          <button className="btn btn-mint" onClick={handleSubmit} disabled={saving || !form.title || !form.code}>
            {saving ? 'Saving...' : (isEdit ? 'Update Snippet' : 'Save Snippet')}
          </button>
        </div>
      </div>
    </div>
  );
}
