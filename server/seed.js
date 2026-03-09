require('dotenv').config();
const mongoose = require('mongoose');
const Snippet = require('./models/Snippet');
const User = require('./models/User');

const seedData = [
  { title: 'React useDebounce Hook', description: 'Custom hook for debouncing values in React components. Useful for search inputs.', language: 'typescript',
    tags: ['react', 'hooks', 'typescript', 'performance'],
    code: `import { useState, useEffect } from 'react';\n\nfunction useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\nexport default useDebounce;` },
  { title: 'Express Error Handler Middleware', description: 'Centralized error handling middleware for Express APIs with proper status codes.', language: 'javascript',
    tags: ['express', 'node', 'middleware', 'error-handling'],
    code: `const errorHandler = (err, req, res, next) => {\n  console.error(err.stack);\n  const status = err.statusCode || 500;\n  res.status(status).json({\n    success: false,\n    message: err.message || 'Internal Server Error',\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })\n  });\n};\n\nmodule.exports = errorHandler;` },
  { title: 'MongoDB Aggregation Pipeline', description: 'Complex aggregation with match, group, sort and lookup for analytics dashboards.', language: 'javascript',
    tags: ['mongodb', 'database', 'aggregation', 'analytics'],
    code: `const pipeline = [\n  { $match: { status: 'active', createdAt: { $gte: new Date('2024-01-01') } } },\n  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },\n  { $unwind: '$user' },\n  { $group: {\n    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },\n    totalRevenue: { $sum: '$amount' },\n    avgOrder: { $avg: '$amount' },\n    count: { $sum: 1 }\n  }},\n  { $sort: { '_id.year': -1, '_id.month': -1 } }\n];` },
  { title: 'Tailwind Glassmorphism Card', description: 'Reusable glassmorphism card component with backdrop blur and border effects.', language: 'html',
    tags: ['tailwind', 'css', 'ui', 'glassmorphism'],
    code: `<div class="relative group">\n  <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-600\n    to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75\n    transition duration-1000"></div>\n  <div class="relative bg-white/10 backdrop-blur-xl rounded-lg\n    border border-white/20 p-6">\n    <h3 class="text-white font-semibold">Glass Card</h3>\n    <p class="text-white/70 mt-2">Content goes here</p>\n  </div>\n</div>` },
  { title: 'Python FastAPI JWT Auth', description: 'JWT authentication setup for FastAPI with password hashing and token creation.', language: 'python',
    tags: ['python', 'fastapi', 'jwt', 'authentication'],
    code: `from fastapi import Depends, HTTPException\nfrom fastapi.security import OAuth2PasswordBearer\nfrom jose import JWTError, jwt\nfrom passlib.context import CryptContext\nfrom datetime import datetime, timedelta\n\nSECRET_KEY = "your-secret-key"\nALGORITHM = "HS256"\n\npwd_context = CryptContext(schemes=["bcrypt"])\noauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")\n\ndef create_token(data: dict, expires_delta: timedelta = None):\n    to_encode = data.copy()\n    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))\n    to_encode.update({"exp": expire})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\nasync def get_current_user(token: str = Depends(oauth2_scheme)):\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        return payload\n    except JWTError:\n        raise HTTPException(status_code=401, detail="Invalid token")` },
  { title: 'Docker Compose Full Stack', description: 'Docker Compose setup for React frontend, Node API, MongoDB, and Redis cache.', language: 'yaml',
    tags: ['docker', 'devops', 'deployment', 'compose'],
    code: `version: '3.8'\nservices:\n  frontend:\n    build: ./client\n    ports: ['3000:3000']\n    depends_on: [api]\n    environment:\n      - REACT_APP_API_URL=http://api:5000\n\n  api:\n    build: ./server\n    ports: ['5000:5000']\n    depends_on: [mongo, redis]\n    environment:\n      - MONGODB_URI=mongodb://mongo:27017/app\n      - REDIS_URL=redis://redis:6379\n\n  mongo:\n    image: mongo:7\n    volumes: ['mongo_data:/data/db']\n    ports: ['27017:27017']\n\n  redis:\n    image: redis:7-alpine\n    ports: ['6379:6379']\n\nvolumes:\n  mongo_data:` },
  { title: 'CSS Grid Auto-fit Gallery', description: 'Responsive image gallery using CSS Grid auto-fit with hover zoom effects.', language: 'css',
    tags: ['css', 'grid', 'responsive', 'gallery'],
    code: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1rem;\n  padding: 1rem;\n}\n\n.gallery-item {\n  position: relative;\n  overflow: hidden;\n  border-radius: 12px;\n  aspect-ratio: 4/3;\n}\n\n.gallery-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n\n.gallery-item:hover img {\n  transform: scale(1.08);\n}\n\n.gallery-item::after {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n\n.gallery-item:hover::after { opacity: 1; }` },
  { title: 'TypeScript Utility Types Cheatsheet', description: 'Common TypeScript utility types and custom type helpers for everyday use.', language: 'typescript',
    tags: ['typescript', 'types', 'utility', 'cheatsheet'],
    code: `// Make all properties optional recursively\ntype DeepPartial<T> = {\n  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];\n};\n\n// Extract non-nullable keys\ntype NonNullableKeys<T> = {\n  [K in keyof T]-?: undefined extends T[K] ? never : K;\n}[keyof T];\n\n// Create a type-safe event emitter\ntype EventMap = Record<string, any>;\ninterface TypedEmitter<T extends EventMap> {\n  on<K extends keyof T>(event: K, fn: (payload: T[K]) => void): void;\n  emit<K extends keyof T>(event: K, payload: T[K]): void;\n}\n\n// Branded types for type-safe IDs\ntype Brand<T, B> = T & { __brand: B };\ntype UserId = Brand<string, 'UserId'>;\ntype OrderId = Brand<string, 'OrderId'>;` },
  { title: 'Zustand Store with Persist', description: 'Zustand state management with localStorage persistence and TypeScript.', language: 'typescript',
    tags: ['react', 'zustand', 'state-management', 'typescript'],
    code: `import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\n\ninterface AppState {\n  theme: 'light' | 'dark';\n  sidebarOpen: boolean;\n  notifications: Notification[];\n  toggleTheme: () => void;\n  toggleSidebar: () => void;\n  addNotification: (n: Notification) => void;\n  clearNotifications: () => void;\n}\n\nexport const useAppStore = create<AppState>()(\n  persist(\n    (set) => ({\n      theme: 'dark',\n      sidebarOpen: true,\n      notifications: [],\n      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),\n      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),\n      addNotification: (n) => set((s) => ({ notifications: [...s.notifications, n] })),\n      clearNotifications: () => set({ notifications: [] }),\n    }),\n    { name: 'app-storage' }\n  )\n);` },
  { title: 'Nginx Reverse Proxy Config', description: 'Nginx configuration for reverse proxy with SSL, caching, and rate limiting.', language: 'bash',
    tags: ['nginx', 'devops', 'ssl', 'proxy'],
    code: `server {\n    listen 443 ssl http2;\n    server_name api.example.com;\n\n    ssl_certificate /etc/ssl/certs/fullchain.pem;\n    ssl_certificate_key /etc/ssl/private/privkey.pem;\n\n    # Rate limiting\n    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n\n    location / {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://localhost:5000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_cache_bypass $http_upgrade;\n    }\n\n    # Static asset caching\n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\n        expires 30d;\n        add_header Cache-Control "public, immutable";\n    }\n}` },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  // Create demo user
  let user = await User.findOne({ email: 'demo@snipstash.dev' });
  if (!user) {
    user = await User.create({ username: 'demo', email: 'demo@snipstash.dev', password: 'demo123' });
    console.log('Demo user created: demo@snipstash.dev / demo123');
  }
  // Clear and re-seed
  await Snippet.deleteMany({ userId: user._id });
  const snippets = seedData.map(s => ({ ...s, userId: user._id }));
  await Snippet.insertMany(snippets);
  console.log(`Seeded ${snippets.length} snippets`);
  mongoose.connection.close();
}

seed().catch(console.error);
