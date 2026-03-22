import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";

/**
 * Makes an authenticated fetch request.
 * - First tries `auth.currentUser` (synchronous, works after hydration).
 * - Falls back to listening once via `onAuthStateChanged` (handles cold starts).
 * - If still no user, makes the request without Authorization so the server
 *   returns a clean 401 which the caller can handle — never throws.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Fast path: if Firebase has already resolved the user, use it immediately
  let currentUser = auth.currentUser;

  // Slow path: wait for Firebase to finish initializing (first page load)
  if (!currentUser) {
    currentUser = await new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach token only if we have a logged-in user
  if (currentUser) {
    try {
      const token = await (currentUser as any).getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    } catch {
      // Token fetch failed (expired session?) — proceed without auth header
    }
  }

  return fetch(url, { ...options, headers });
}
