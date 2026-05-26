export interface SupabaseUser {
  id: string;
  email?: string;
  created_at?: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: SupabaseUser;
}

export interface AuthResult {
  session: SupabaseSession | null;
  needsEmailConfirmation?: boolean;
}

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: SupabaseUser;
  session?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: SupabaseUser;
  } | null;
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const toError = (payload: AuthResponse, fallback: string) =>
  new Error(payload.error_description || payload.message || payload.msg || payload.error || fallback);

async function request<T extends AuthResponse>(path: string, init: RequestInit = {}) {
  const baseUrl = supabaseUrl;
  const anonKey = supabaseAnonKey;

  if (!baseUrl || !anonKey) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  const response = await fetch(`${baseUrl}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
      ...init.headers
    }
  });
  const payload = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw toError(payload, "Supabase Anfrage fehlgeschlagen.");
  }

  return payload;
}

const toSession = (payload: AuthResponse): SupabaseSession | null => {
  const accessToken = payload.access_token ?? payload.session?.access_token;
  const refreshToken = payload.refresh_token ?? payload.session?.refresh_token;
  const expiresIn = payload.expires_in ?? payload.session?.expires_in;
  const user = payload.user ?? payload.session?.user;

  if (!accessToken || !user) {
    return null;
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined,
    user
  };
};

export async function signUpWithEmail(email: string, password: string, redirectTo?: string): Promise<AuthResult> {
  const redirectQuery = redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : "";
  const payload = await request<AuthResponse>(`/signup${redirectQuery}`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: {
        product: "Aurora Finance"
      }
    })
  });
  const session = toSession(payload);

  return {
    session,
    needsEmailConfirmation: !session
  };
}

export async function signInWithEmail(email: string, password: string): Promise<SupabaseSession> {
  const payload = await request<AuthResponse>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  const session = toSession(payload);

  if (!session) {
    throw new Error("Anmeldung fehlgeschlagen.");
  }

  return session;
}

export async function refreshAuthSession(refreshToken: string): Promise<SupabaseSession> {
  const payload = await request<AuthResponse>("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const session = toSession(payload);

  if (!session) {
    throw new Error("Session konnte nicht erneuert werden.");
  }

  return session;
}

export async function getAuthenticatedUser(accessToken: string): Promise<SupabaseUser> {
  const payload = await request<AuthResponse & SupabaseUser>("/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!payload.id) {
    throw new Error("Nutzer konnte nicht geladen werden.");
  }

  return payload;
}

export async function signOutSession(accessToken: string) {
  await request<AuthResponse>("/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
