import { afterEach, describe, expect, it, vi } from "vitest";

// O módulo lê import.meta.env na hora do import, então cada teste precisa de
// uma instância nova. Valores vazios são definidos de forma explícita para que
// um `.env.local` do desenvolvedor não vaze para dentro dos testes.
async function carregarModulo() {
  vi.resetModules();
  return import("../lib/supabase/client");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("cliente Supabase", () => {
  it("não cria o cliente quando as variáveis estão vazias", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");

    const { supabase, isSupabaseConfigured } = await carregarModulo();

    expect(supabase).toBeNull();
    expect(isSupabaseConfigured).toBe(false);
  });

  it("trata variáveis só com espaços como não configuradas", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "   ");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "   ");

    const { supabase, isSupabaseConfigured } = await carregarModulo();

    expect(supabase).toBeNull();
    expect(isSupabaseConfigured).toBe(false);
  });

  it("não cria o cliente se faltar a chave pública", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "");

    const { supabase, isSupabaseConfigured } = await carregarModulo();

    expect(supabase).toBeNull();
    expect(isSupabaseConfigured).toBe(false);
  });

  it("não cria o cliente se faltar a URL", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");

    const { supabase, isSupabaseConfigured } = await carregarModulo();

    expect(supabase).toBeNull();
    expect(isSupabaseConfigured).toBe(false);
  });

  it("cria o cliente quando URL e chave pública estão definidas", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://exemplo.supabase.co");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_teste");

    const { supabase, isSupabaseConfigured } = await carregarModulo();

    expect(supabase).not.toBeNull();
    expect(isSupabaseConfigured).toBe(true);
  });
});
