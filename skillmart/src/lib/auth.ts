export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function authErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "");
    if (message) return message;
  }
  return "Authentication failed. Check your email and password.";
}

export function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "Wrong email or password. If you just signed up, use the exact password from sign-up.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirm your email first — check your inbox for the Supabase link, then sign in.";
  }
  if (lower.includes("user already registered") || lower.includes("user_already_exists")) {
    return "This email is already registered. Switch to Sign In and use your existing password.";
  }
  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 6 characters.";
  }
  if (lower.includes("rate limit")) {
    return "Too many attempts. Wait a minute and try again.";
  }

  return message;
}
