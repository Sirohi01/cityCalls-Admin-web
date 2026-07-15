import { z } from 'zod';

// Mirrors citycalls-api's Zod schema (src/modules/auth/auth.validation.ts) so
// client-side validation matches server-side exactly — a UX convenience only,
// never a substitute for the server's own enforcement (docs/10-api-standards.md §10).
export const loginSchema = z.object({
  identifier: z.string().min(3, 'Enter an email or mobile number'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
