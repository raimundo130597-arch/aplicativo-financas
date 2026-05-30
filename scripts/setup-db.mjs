import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas.");
  process.exit(1);
}

console.log(`🔗 Conectando em: ${SUPABASE_URL}`);

// 1. Testa conectividade
async function testConnection() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (res.ok || res.status === 200) {
      console.log("✅ Conexão com Supabase OK");
      return true;
    }
    console.log(`⚠️  Status: ${res.status}`);
    return false;
  } catch (e) {
    console.error("❌ Falha na conexão:", e.message);
    return false;
  }
}

// 2. Verifica se tabela transactions existe
async function tableExists() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/transactions?limit=1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (res.status === 200) {
    console.log("✅ Tabela 'transactions' já existe");
    return true;
  }
  const body = await res.json().catch(() => ({}));
  if (body?.message?.includes("does not exist") || res.status === 404) {
    console.log("⚠️  Tabela 'transactions' não encontrada");
    return false;
  }
  console.log(`ℹ️  Resposta: ${res.status} - ${JSON.stringify(body)}`);
  return false;
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    console.log("\n💡 Verifique se o SUPABASE_URL e SUPABASE_ANON_KEY no .env.local estão corretos.");
    process.exit(1);
  }

  const exists = await tableExists();
  if (!exists) {
    const schemaPath = join(__dirname, "..", "supabase", "schema.sql");
    const sql = readFileSync(schemaPath, "utf-8");

    console.log("\n📋 Para criar a tabela, execute o SQL abaixo no Supabase Dashboard:");
    console.log("   → https://supabase.com/dashboard/project/vpxfbnndzxlfnlflwnlr/sql/new\n");
    console.log("─".repeat(60));
    console.log(sql);
    console.log("─".repeat(60));
    console.log("\n💡 Após executar o SQL, rode novamente: npm run dev");
  } else {
    console.log("\n🚀 Banco configurado! Execute: npm run dev");
  }
}

main().catch(console.error);
