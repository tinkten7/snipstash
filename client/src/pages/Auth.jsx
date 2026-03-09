import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>
          <span style={{ fontSize: '28px' }}>&#x2702;&#xFE0F;</span>{' '}
          Snip<span className="mint">Stash</span>
        </h1>
        <p className="subtitle">{isLogin ? 'Sign in to your snippet library' : 'Create your account'}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="label">Username</label>
              <input className="input" value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
                placeholder="johndoe" required={!isLogin} />
            </div>
          )}
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Min 6 characters" required />
          </div>
          <button className="btn btn-mint" disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '8px' }}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
