import {
  deleteCookie,
  getSignedCookie,
  setSignedCookie,
} from "https://deno.land/x/hono@v3.12.11/helper.ts";

const WEEK_IN_MILLISECONDS = 604800000; // One week in milliseconds

const createSession = async (c, user) => {
  const sessionId = crypto.randomUUID();
  await setSignedCookie(c, "sessionId", sessionId, "your-secret", {
    path: "/",
  });

  const kv = await Deno.openKv();
  await kv.set(["sessions", sessionId], user, {
    expireIn: WEEK_IN_MILLISECONDS,
  });
};

const deleteSession = async (c) => {
  const sessionId = await getSignedCookie(c, "your-secret", "sessionId");
  if (!sessionId) {
    return;
  }

  deleteCookie(c, "sessionId", { path: "/" });
  const kv = await Deno.openKv();
  await kv.delete(["sessions", sessionId]);
};

const getUserFromSession = async (c) => {
  const sessionId = await getSignedCookie(c, "your-secret", "sessionId");
  if (!sessionId) {
    return null; // No session found
  }

  const kv = await Deno.openKv();
  const user = await kv.get(["sessions", sessionId]);
  const foundUser = user?.value ?? null;

  // If user is found, reset the expiration time
  if (foundUser) {
    await kv.set(["sessions", sessionId], foundUser, {
      expireIn: WEEK_IN_MILLISECONDS,
    });
  }

  return foundUser;
};

export { createSession, deleteSession, getUserFromSession };
