
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase/client";
import {
  AuthContext,
  type AuthContextValue,
  type OAuthProvider,
} from "./auth-context";

type AuthClient = SupabaseClient;

function getRedirectUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

export function AuthProvider({
  children,
  client = supabase,
}: {
  children: ReactNode;
  client?: AuthClient | null;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(() => client !== null);
  const [initializationError, setInitializationError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!client) return;

    let mounted = true;

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);
      setLoading(false);
      setInitializationError(null);
    });

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;

        if (error) {
          setInitializationError(
            "Não foi possível verificar sua sessão.",
          );
        } else {
          setSession(data.session);
        }

        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;

        setSession(null);
        setInitializationError(
          "Não foi possível inicializar a autenticação.",
        );
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const requireClient = useCallback((): AuthClient => {
    if (!client) {
      throw new Error(
        "Supabase não configurado. Verifique o arquivo .env.local.",
      );
    }

    return client;
  }, [client]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await requireClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
    },
    [requireClient],
  );

  const signInWithOAuth = useCallback(
    async (provider: OAuthProvider) => {
      const { error } = await requireClient().auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getRedirectUrl("/auth/callback"),
        },
      });

      if (error) throw error;
    },
    [requireClient],
  );

  const signUp = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
    ) => {
      const { data, error } = await requireClient().auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: getRedirectUrl("/auth/callback"),
        },
      });

      if (error) throw error;

      return {
        needsEmailConfirmation: !data.session,
      };
    },
    [requireClient],
  );

  const sendPasswordReset = useCallback(
    async (email: string) => {
      const { error } = await requireClient().auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: getRedirectUrl("/redefinir-senha"),
        },
      );

      if (error) throw error;
    },
    [requireClient],
  );

  const updatePassword = useCallback(
    async (password: string) => {
      const { error } = await requireClient().auth.updateUser({
        password,
      });

      if (error) throw error;
    },
    [requireClient],
  );

  const signOut = useCallback(async () => {
    const { error } = await requireClient().auth.signOut({
      scope: "local",
    });

    if (error) throw error;
  }, [requireClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isConfigured: client !== null,
      initializationError,
      signInWithPassword,
      signInWithOAuth,
      signUp,
      sendPasswordReset,
      updatePassword,
      signOut,
    }),
    [
      session,
      loading,
      client,
      initializationError,
      signInWithPassword,
      signInWithOAuth,
      signUp,
      sendPasswordReset,
      updatePassword,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
