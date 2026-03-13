import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getUserByEmail, getUserById, createSession, getSession, deleteSession, createUser } from './db';

export const SESSION_COOKIE = 'ba_session';
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; sessionId?: string }> {
  const user = await getUserByEmail(email);
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  await createSession({ id: sessionId, user_id: user.id, expires_at: expiresAt });

  return { success: true, sessionId };
}

export async function logout(sessionId?: string): Promise<void> {
  if (!sessionId) {
    return;
  }

  await deleteSession(sessionId);
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const session = await getSession(sessionId);
    if (!session) return null;

    const user = await getUserById(session.user_id);
    if (!user) return null;

    const { password_hash, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}

export async function ensureAdminUser(): Promise<void> {
  const existing = await getUserByEmail('admin@blackarrowfg.com');
  if (!existing) {
    const hash = await hashPassword('BlackArrow2024!');
    await createUser({
      id: uuidv4(),
      email: 'admin@blackarrowfg.com',
      password_hash: hash,
      name: 'Admin',
      role: 'admin',
    });
  }
}
