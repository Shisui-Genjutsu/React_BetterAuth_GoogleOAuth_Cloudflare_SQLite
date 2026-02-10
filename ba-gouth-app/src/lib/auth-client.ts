import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL + "/api/auth"
});

export const signIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.origin + "/blog",
    errorCallbackURL: window.location.origin + "/auth-error"
  });
};

export default authClient;