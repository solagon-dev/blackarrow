import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'blackarrow.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT,
      featured_image TEXT,
      seo_title TEXT,
      seo_description TEXT,
      status TEXT DEFAULT 'draft',
      author_id TEXT,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      form_type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  `);
}

// Post operations
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function getAllPosts(status?: string): Post[] {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT * FROM posts WHERE status = ? ORDER BY published_at DESC, created_at DESC').all(status) as Post[];
  }
  return db.prepare('SELECT * FROM posts ORDER BY published_at DESC, created_at DESC').all() as Post[];
}

export function getPostBySlug(slug: string): Post | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug) as Post | undefined;
}

export function getPostById(id: string): Post | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
}

export function getPostsByCategory(category: string): Post[] {
  const db = getDb();
  return db.prepare('SELECT * FROM posts WHERE category = ? AND status = ? ORDER BY published_at DESC').all(category, 'published') as Post[];
}

export function createPost(post: Omit<Post, 'created_at' | 'updated_at'>): Post {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO posts (id, title, slug, excerpt, content, category, featured_image, seo_title, seo_description, status, author_id, published_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    post.id, post.title, post.slug, post.excerpt, post.content, post.category,
    post.featured_image, post.seo_title, post.seo_description, post.status,
    post.author_id, post.published_at, now, now
  );
  return getPostById(post.id)!;
}

export function updatePost(id: string, updates: Partial<Post>): Post | undefined {
  const db = getDb();
  const existing = getPostById(id);
  if (!existing) return undefined;

  const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => (updates as Record<string, unknown>)[f]);

  db.prepare(`UPDATE posts SET ${sets}, updated_at = ? WHERE id = ?`).run(
    ...values, new Date().toISOString(), id
  );
  return getPostById(id);
}

export function deletePost(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getCategories(): string[] {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT category FROM posts WHERE category IS NOT NULL AND status = ? ORDER BY category').all('published') as { category: string }[];
  return rows.map(r => r.category);
}

export function getRelatedPosts(slug: string, category: string | null, limit = 3): Post[] {
  const db = getDb();
  if (category) {
    return db.prepare(
      'SELECT * FROM posts WHERE slug != ? AND category = ? AND status = ? ORDER BY published_at DESC LIMIT ?'
    ).all(slug, category, 'published', limit) as Post[];
  }
  return db.prepare(
    'SELECT * FROM posts WHERE slug != ? AND status = ? ORDER BY published_at DESC LIMIT ?'
  ).all(slug, 'published', limit) as Post[];
}

// User operations
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

export function getUserByEmail(email: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function createUser(user: { id: string; email: string; password_hash: string; name: string; role?: string }): User {
  const db = getDb();
  db.prepare('INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)').run(
    user.id, user.email, user.password_hash, user.name, user.role || 'admin'
  );
  return getUserById(user.id)!;
}

// Session operations
export function createSession(session: { id: string; user_id: string; expires_at: string }): void {
  const db = getDb();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(
    session.id, session.user_id, session.expires_at
  );
}

export function getSession(id: string): { id: string; user_id: string; expires_at: string } | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM sessions WHERE id = ? AND expires_at > ?').get(id, new Date().toISOString()) as { id: string; user_id: string; expires_at: string } | undefined;
}

export function deleteSession(id: string): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
}

export function deleteExpiredSessions(): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(new Date().toISOString());
}

// Form submissions
export function createFormSubmission(submission: { id: string; form_type: string; data: string }): void {
  const db = getDb();
  db.prepare('INSERT INTO form_submissions (id, form_type, data) VALUES (?, ?, ?)').run(
    submission.id, submission.form_type, submission.data
  );
}
