import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type OAuthProvider = "google" | "apple";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initializationError: string | null;

  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<void>;

  signInWithOAuth: (
    provider: OAuthProvider
  ) => Promise<void>;

  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ needsEmailConfirmation: boolean }>;

  sendPasswordReset: (
    email: string
  ) => Promise<void>;

  updatePassword: (
    password: string
  ) => Promise<void>;

  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
