import SmartCast from "vizio-smart-cast";

interface TvSession {
  tv: SmartCast;
  tvIp: string;
}

// Simple in-memory store for TV instances
// In a multi-user scenario, you'd want to use sessions or a database
const tvStore = new Map<string, TvSession>();

export function getTvInstance(sessionId: string): SmartCast | null {
  return tvStore.get(sessionId)?.tv || null;
}

export function getTvIp(sessionId: string): string | null {
  return tvStore.get(sessionId)?.tvIp || null;
}

export function setTvInstance(
  sessionId: string,
  tv: SmartCast,
  tvIp: string
): void {
  tvStore.set(sessionId, { tv, tvIp });
}

export function removeTvInstance(sessionId: string): void {
  tvStore.delete(sessionId);
}

export function getOrCreateSessionId(event: any): string {
  // Use Nuxt's cookie utilities
  const sessionId = getCookie(event, "sessionId");

  if (!sessionId) {
    const newSessionId = generateSessionId();
    setCookie(event, "sessionId", newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return newSessionId;
  }

  return sessionId;
}

function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
