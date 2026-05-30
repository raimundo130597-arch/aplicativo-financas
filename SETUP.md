# FinançasPro — Setup Guide

## 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Variáveis de ambiente

Edite `.env.local` com os valores do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 4. Deploy na Vercel

1. `git init && git add . && git commit -m "initial commit"`
2. Push para GitHub
3. Importe no [vercel.com](https://vercel.com)
4. Adicione as variáveis de ambiente no painel da Vercel
5. Deploy automático

## Supabase Auth — Configurações recomendadas

- Em **Authentication → URL Configuration**, adicione:
  - Site URL: `https://seu-app.vercel.app`
  - Redirect URLs: `https://seu-app.vercel.app/auth/callback`
- Para desativar confirmação de e-mail (desenvolvimento): **Auth → Email** → desative "Confirm email"
