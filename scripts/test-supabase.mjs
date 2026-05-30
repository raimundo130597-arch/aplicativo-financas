import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vpxfbnndzxlfnlflwnlr.supabase.co";
const SUPABASE_KEY = "sb_publishable_3PoFL0kDjAR6j5lckcomxQ_9ymyzF4i";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔗 Testando conexão...");

const { data, error } = await supabase.from("transactions").select("count").limit(1);

if (error) {
  console.log("❌ Erro:", error.message);
  console.log("   Code:", error.code);
  console.log("   Details:", error.details);
  console.log("   Hint:", error.hint);
} else {
  console.log("✅ Tabela transactions acessível:", data);
}

// Testa auth
const { data: authData, error: authError } = await supabase.auth.getSession();
console.log("\n🔑 Auth status:", authError ? authError.message : "OK - " + (authData?.session ? "com sessão" : "sem sessão ativa"));
