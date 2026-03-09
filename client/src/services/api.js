const API = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('snipstash_token');
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: 'Bearer ' + token }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message);
  }
  return res.json();
}

export const auth = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

export const snippets = {
  getAll: (params) => request('/snippets?' + new URLSearchParams(params)),
  search: (params) => request('/snippets/search?' + new URLSearchParams(params)),
  create: (data) => request('/snippets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request('/snippets/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request('/snippets/' + id, { method: 'DELETE' }),
  toggleFav: (id) => request('/snippets/' + id + '/favorite', { method: 'PATCH' }),
  trackCopy: (id) => request('/snippets/' + id + '/copy', { method: 'PATCH' }),
  getTags: () => request('/snippets/meta/tags'),
  getLanguages: () => request('/snippets/meta/languages'),
  getStats: () => request('/snippets/meta/stats'),
};
