import postgres, { type Sql } from 'postgres';

let sqlClient: Sql | null = null;
let initializationPromise: Promise<void> | null = null;

type PostRow = {
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
  published_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: Date | string;
};

type SessionRow = {
  id: string;
  user_id: string;
  expires_at: Date | string;
  created_at?: Date | string;
};

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

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

function getSql(): Sql {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error('Missing DATABASE_URL');
  }

  if (!sqlClient) {
    sqlClient = postgres(connectionString, {
      prepare: false,
      max: 1,
    });
  }

  return sqlClient;
}

async function ensureInitialized(): Promise<Sql> {
  const sql = getSql();

  if (!initializationPromise) {
    initializationPromise = initializeDb(sql);
  }

  await initializationPromise;
  return sql;
}

async function initializeDb(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
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
      status TEXT NOT NULL DEFAULT 'draft',
      author_id TEXT REFERENCES users(id),
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      form_type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;
}

function toISOString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function toOptionalISOString(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }

  return toISOString(value);
}

function mapPost(row: PostRow): Post {
  return {
    ...row,
    published_at: toOptionalISOString(row.published_at),
    created_at: toISOString(row.created_at),
    updated_at: toISOString(row.updated_at),
  };
}

function mapUser(row: UserRow): User {
  return {
    ...row,
    created_at: toISOString(row.created_at),
  };
}

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    user_id: row.user_id,
    expires_at: toISOString(row.expires_at),
    created_at: row.created_at ? toISOString(row.created_at) : new Date().toISOString(),
  };
}

// Post operations
export async function getAllPosts(status?: string): Promise<Post[]> {
  const sql = await ensureInitialized();
  const rows = status
    ? await sql<PostRow[]>`
        SELECT * FROM posts
        WHERE status = ${status}
        ORDER BY published_at DESC NULLS LAST, created_at DESC
      `
    : await sql<PostRow[]>`
        SELECT * FROM posts
        ORDER BY published_at DESC NULLS LAST, created_at DESC
      `;

  return rows.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const sql = await ensureInitialized();
  const [row] = await sql<PostRow[]>`SELECT * FROM posts WHERE slug = ${slug} LIMIT 1`;
  return row ? mapPost(row) : undefined;
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const sql = await ensureInitialized();
  const [row] = await sql<PostRow[]>`SELECT * FROM posts WHERE id = ${id} LIMIT 1`;
  return row ? mapPost(row) : undefined;
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const sql = await ensureInitialized();
  const rows = await sql<PostRow[]>`
    SELECT * FROM posts
    WHERE category = ${category} AND status = 'published'
    ORDER BY published_at DESC NULLS LAST, created_at DESC
  `;

  return rows.map(mapPost);
}

export async function createPost(post: Omit<Post, 'created_at' | 'updated_at'>): Promise<Post> {
  const sql = await ensureInitialized();
  const now = new Date().toISOString();
  const [row] = await sql<PostRow[]>`
    INSERT INTO posts (
      id, title, slug, excerpt, content, category, featured_image,
      seo_title, seo_description, status, author_id, published_at, created_at, updated_at
    ) VALUES (
      ${post.id}, ${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.category}, ${post.featured_image},
      ${post.seo_title}, ${post.seo_description}, ${post.status}, ${post.author_id}, ${post.published_at}, ${now}, ${now}
    )
    RETURNING *
  `;

  return mapPost(row);
}

const updatablePostFields = [
  'title',
  'slug',
  'excerpt',
  'content',
  'category',
  'featured_image',
  'seo_title',
  'seo_description',
  'status',
  'author_id',
  'published_at',
] as const;

type UpdatablePostField = (typeof updatablePostFields)[number];

export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | undefined> {
  const sql = await ensureInitialized();
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(
      ([key, value]) => updatablePostFields.includes(key as UpdatablePostField) && value !== undefined
    )
  ) as Partial<Record<UpdatablePostField, Post[UpdatablePostField]>>;

  if (Object.keys(sanitizedUpdates).length === 0) {
    return getPostById(id);
  }

  const [row] = await sql<PostRow[]>`
    UPDATE posts
    SET ${sql({ ...sanitizedUpdates, updated_at: new Date().toISOString() })}
    WHERE id = ${id}
    RETURNING *
  `;

  return row ? mapPost(row) : undefined;
}

export async function deletePost(id: string): Promise<boolean> {
  const sql = await ensureInitialized();
  const rows = await sql<{ id: string }[]>`DELETE FROM posts WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getCategories(): Promise<string[]> {
  const sql = await ensureInitialized();
  const rows = await sql<{ category: string }[]>`
    SELECT DISTINCT category
    FROM posts
    WHERE category IS NOT NULL AND status = 'published'
    ORDER BY category
  `;

  return rows.map((row) => row.category);
}

export async function getRelatedPosts(slug: string, category: string | null, limit = 3): Promise<Post[]> {
  const sql = await ensureInitialized();
  const rows = category
    ? await sql<PostRow[]>`
        SELECT * FROM posts
        WHERE slug != ${slug} AND category = ${category} AND status = 'published'
        ORDER BY published_at DESC NULLS LAST
        LIMIT ${limit}
      `
    : await sql<PostRow[]>`
        SELECT * FROM posts
        WHERE slug != ${slug} AND status = 'published'
        ORDER BY published_at DESC NULLS LAST
        LIMIT ${limit}
      `;

  return rows.map(mapPost);
}

// User operations
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const sql = await ensureInitialized();
  const [row] = await sql<UserRow[]>`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return row ? mapUser(row) : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const sql = await ensureInitialized();
  const [row] = await sql<UserRow[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return row ? mapUser(row) : undefined;
}

export async function createUser(user: { id: string; email: string; password_hash: string; name: string; role?: string }): Promise<User> {
  const sql = await ensureInitialized();
  const [row] = await sql<UserRow[]>`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (${user.id}, ${user.email}, ${user.password_hash}, ${user.name}, ${user.role || 'admin'})
    RETURNING *
  `;

  return mapUser(row);
}

// Session operations
export async function createSession(session: { id: string; user_id: string; expires_at: string }): Promise<void> {
  const sql = await ensureInitialized();
  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${session.id}, ${session.user_id}, ${session.expires_at})
  `;
}

export async function getSession(id: string): Promise<Session | undefined> {
  const sql = await ensureInitialized();
  const [row] = await sql<SessionRow[]>`
    SELECT * FROM sessions
    WHERE id = ${id} AND expires_at > ${new Date().toISOString()}
    LIMIT 1
  `;

  return row ? mapSession(row) : undefined;
}

export async function deleteSession(id: string): Promise<void> {
  const sql = await ensureInitialized();
  await sql`DELETE FROM sessions WHERE id = ${id}`;
}

export async function deleteExpiredSessions(): Promise<void> {
  const sql = await ensureInitialized();
  await sql`DELETE FROM sessions WHERE expires_at <= ${new Date().toISOString()}`;
}

// Form submissions
export async function createFormSubmission(submission: { id: string; form_type: string; data: string }): Promise<void> {
  const sql = await ensureInitialized();
  await sql`
    INSERT INTO form_submissions (id, form_type, data)
    VALUES (${submission.id}, ${submission.form_type}, ${submission.data})
  `;
}
