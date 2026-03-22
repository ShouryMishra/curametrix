import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Wait for auth to initialize if needed
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await (user as any).getIdToken();
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, { ...options, headers });
}
