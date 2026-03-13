import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import postgres from 'postgres';

const SQLITE_PATH = path.join(process.cwd(), 'data', 'blackarrow.db');
const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

function readEnvValue(name: string): string | undefined {
  if (process.env[name]?.trim()) {
    return process.env[name]?.trim();
  }

  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    return undefined;
  }

  const envFile = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
  const match = envFile.match(new RegExp(`^${name}=(.*)$`, 'm'));
  if (!match) {
    return undefined;
  }

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName) as { name?: string } | undefined;

  return Boolean(row?.name);
}

async function ensureSchema(sql: postgres.Sql) {
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

async function main() {
  const databaseUrl = readEnvValue('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL. Add it to .env.local or your shell environment before running this script.');
  }

  if (!fs.existsSync(SQLITE_PATH)) {
    throw new Error(`SQLite database not found at ${SQLITE_PATH}`);
  }

  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  const sql = postgres(databaseUrl, { prepare: false, max: 1 });

  try {
    await ensureSchema(sql);

    const users = tableExists(sqlite, 'users') ? sqlite.prepare('SELECT * FROM users').all() as Array<Record<string, unknown>> : [];
    const posts = tableExists(sqlite, 'posts') ? sqlite.prepare('SELECT * FROM posts').all() as Array<Record<string, unknown>> : [];
    const formSubmissions = tableExists(sqlite, 'form_submissions')
      ? sqlite.prepare('SELECT * FROM form_submissions').all() as Array<Record<string, unknown>>
      : [];
    const sessions = tableExists(sqlite, 'sessions') ? sqlite.prepare('SELECT * FROM sessions').all() as Array<Record<string, unknown>> : [];

    console.log(`Migrating ${users.length} users, ${posts.length} posts, ${formSubmissions.length} form submissions, and ${sessions.length} sessions to Neon.`);

    for (const user of users) {
      await sql`
        INSERT INTO users (id, email, password_hash, name, role, created_at)
        VALUES (
          ${String(user.id)},
          ${String(user.email)},
          ${String(user.password_hash)},
          ${String(user.name)},
          ${String(user.role || 'admin')},
          ${user.created_at ? String(user.created_at) : new Date().toISOString()}
        )
        ON CONFLICT (email) DO UPDATE SET
          id = EXCLUDED.id,
          password_hash = EXCLUDED.password_hash,
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          created_at = EXCLUDED.created_at
      `;
    }

    for (const post of posts) {
      await sql`
        INSERT INTO posts (
          id, title, slug, excerpt, content, category, featured_image,
          seo_title, seo_description, status, author_id, published_at, created_at, updated_at
        ) VALUES (
          ${String(post.id)},
          ${String(post.title)},
          ${String(post.slug)},
          ${post.excerpt ? String(post.excerpt) : null},
          ${String(post.content)},
          ${post.category ? String(post.category) : null},
          ${post.featured_image ? String(post.featured_image) : null},
          ${post.seo_title ? String(post.seo_title) : null},
          ${post.seo_description ? String(post.seo_description) : null},
          ${String(post.status || 'draft')},
          ${post.author_id ? String(post.author_id) : null},
          ${post.published_at ? String(post.published_at) : null},
          ${post.created_at ? String(post.created_at) : new Date().toISOString()},
          ${post.updated_at ? String(post.updated_at) : new Date().toISOString()}
        )
        ON CONFLICT (slug) DO UPDATE SET
          id = EXCLUDED.id,
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          featured_image = EXCLUDED.featured_image,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          status = EXCLUDED.status,
          author_id = EXCLUDED.author_id,
          published_at = EXCLUDED.published_at,
          created_at = EXCLUDED.created_at,
          updated_at = EXCLUDED.updated_at
      `;
    }

    for (const submission of formSubmissions) {
      await sql`
        INSERT INTO form_submissions (id, form_type, data, created_at)
        VALUES (
          ${String(submission.id)},
          ${String(submission.form_type)},
          ${String(submission.data)},
          ${submission.created_at ? String(submission.created_at) : new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
          form_type = EXCLUDED.form_type,
          data = EXCLUDED.data,
          created_at = EXCLUDED.created_at
      `;
    }

    for (const session of sessions) {
      await sql`
        INSERT INTO sessions (id, user_id, expires_at, created_at)
        VALUES (
          ${String(session.id)},
          ${String(session.user_id)},
          ${String(session.expires_at)},
          ${session.created_at ? String(session.created_at) : new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
          user_id = EXCLUDED.user_id,
          expires_at = EXCLUDED.expires_at,
          created_at = EXCLUDED.created_at
      `;
    }

    const [postCount] = await sql<{ count: string }[]>`SELECT COUNT(*)::text AS count FROM posts`;
    console.log(`Neon migration complete. Remote posts count: ${postCount?.count ?? '0'}`);
  } finally {
    sqlite.close();
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error('Neon migration failed:', error);
  process.exit(1);
});
