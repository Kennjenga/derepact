// actions/auth.ts
import { z } from "zod";

// Define the Zod schema for login validation
export const LoginSchema = z.object({
    email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

// Define the return type for the login action
export type LoginResult = {
    success?: boolean;
    user?: {
      uid: number;
      email: string;
      username: string;
      phone?: string | null;
      password: string; // This is protected in the response
    };
    errors?: {
      email?: string[];
      password?: string[];
      database?: string[];
    };
  };