# VTAL Unidades — consulta e cadastro de unidades de manutenção

Sistema web responsivo (Next.js 16 + PostgreSQL/Neon) para consultar, cadastrar, editar e excluir as unidades,
com usuários e permissões definidas pelo administrador.

## O que tem

- **Login** com sessão segura (cookie httpOnly, 12 h), bloqueio de 15 min após 5 senhas erradas.
- **Painel**: totais, unidades por UF, status e últimas atualizações (sempre limitado às UFs do usuário).
- **Unidades**: busca (nome, Cloud NVR, IP, MAC, observação), filtros por UF/status, ordenação, paginação,
  tabela no computador e cartões no celular; detalhe com botões de copiar e de mostrar senha; histórico por unidade.
- **Exportar Excel** respeitando filtros e permissões.
- **Usuários (admin)**: perfil Admin (tudo) ou Técnico com permissões individuais:
  - UFs permitidas (todas ou uma lista)
  - Visualizar · Incluir · Editar · Excluir · **Ver senhas** · Exportar
  - Ativar/desativar, redefinir senha, exigir troca no próximo acesso
  - Desativar ou redefinir a senha derruba as sessões abertas daquele usuário na hora.
- **Importar planilha (admin)**: lê o .xlsx do sistema antigo (abas `UNIDADES` e `USUARIOS`), atualiza pelo nome da
  unidade, corrige IPs que o Sheets transformou em número (`200223200118` → `200.223.200.118`), HD, cadeado etc.
  As senhas antigas dos usuários **não** são importadas — todos recebem uma senha temporária e trocam no 1º acesso.
- **Histórico (admin)**: quem criou, alterou (campo a campo), excluiu ou importou. Senhas aparecem mascaradas.

Todas as regras de permissão são checadas **no servidor**. Quem não tem "Ver senhas" não recebe as senhas nem no HTML.

## Publicar (Vercel + Neon)

1. **GitHub**: crie um repositório **privado** e envie esta pasta (`git init`, `git add .`, `git commit`, `git push`).
2. **Vercel** → *Add New → Project* → importe o repositório. Não precisa mudar nada no build.
3. No projeto da Vercel → aba **Storage** → *Create Database* → **Neon** (Postgres) → região **São Paulo (sa-east-1)**
   → conecte ao projeto. Isso cria a variável `DATABASE_URL` automaticamente.
4. Em **Settings → Environment Variables** adicione `AUTH_SECRET` com um texto aleatório de 40+ caracteres
   (ex.: gere em https://generate-secret.vercel.app/64 ou com `openssl rand -base64 48`).
5. **Criar as tabelas e o primeiro admin** (no seu computador, com Node 20+):
   ```bash
   npm install
   cp .env.example .env.local      # cole a DATABASE_URL do Neon e preencha ADMIN_*
   npm run db:setup
   ```
   (Se preferir, `npx vercel env pull .env.local` baixa a DATABASE_URL da Vercel.)
6. Na Vercel → *Deployments* → **Redeploy**. Entre com o admin, vá em **Importar planilha** e envie o .xlsx.

## Rodar no computador

```bash
npm install
cp .env.example .env.local   # preencha
npm run db:setup
npm run dev                  # http://localhost:3000
```

## Estrutura

```
db/schema.sql            tabelas (usuarios, unidades, historico)
scripts/setup-db.mjs     cria tabelas + 1º admin
src/proxy.ts             bloqueia rotas sem login
src/lib/                 banco, sessão, permissões, importação
src/actions/             ações do servidor (salvar/excluir/importar)
src/app/(app)/           telas: painel, unidades, usuários, importar, histórico, conta
```
