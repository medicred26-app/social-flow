export const ALLOWED_ADMIN_EMAILS = [
  'theblack2205@gmail.com',
  'medicred26@gmail.com'
];

/**
 * Validates if the given user is an authorized admin.
 * Requirements:
 * 1. Must be logged in
 * 2. Provider MUST be 'google' (Google OAuth)
 * 3. Email MUST match one of the allowed admin emails:
 *    - theblack2205@gmail.com
 *    - medicred26@gmail.com
 */
export function isAuthorizedAdmin(user: { email?: string; provider?: string } | null): boolean {
  if (!user) return false;
  if (user.provider !== 'google') return false;
  if (!user.email) return false;
  
  const email = user.email.toLowerCase().trim();
  return ALLOWED_ADMIN_EMAILS.includes(email);
}
