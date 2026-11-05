# Deploy das duas demos

Mesmo repositório, duas demos totalmente separadas:

| Demo | Banco (Neon) | API (Render) | Site (Vercel) | Pasta no Cloudinary |
| --- | --- | --- | --- | --- |
| Imobiliária | `vitrine-imobiliaria` | `vitrine-api-imobiliaria` | `vitrine-imobiliaria` | `vitrine/imobiliaria` |
| Guincho | `vitrine-guincho` | `vitrine-api-guincho` | `vitrine-guincho` | `vitrine/guincho` |

Tudo é configurado pelos painéis; nenhum segredo vai para o Git.
Os passos seguem uma ordem por causa das dependências: o site precisa da URL da API, e a API
precisa da URL do site (para CORS e revalidação).

---

## 0. Segredos que você vai gerar

Para **cada** demo, gere um `REVALIDATE_SECRET` (o mesmo valor vai no Render e na Vercel):

```bash
openssl rand -hex 32
```

O `JWT_SECRET` o Render gera sozinho (`generateValue` no `render.yaml`).

## 1. Cloudinary (uma conta serve para as duas)

1. Em **Settings → API Keys**, copie `Cloud name`, `API Key` e `API Secret`.
2. As pastas são criadas sozinhas no primeiro upload: `vitrine/imobiliaria` e `vitrine/guincho`
   (já vêm definidas no `render.yaml` em `CLOUDINARY_FOLDER`).

## 2. Neon: dois bancos

1. Crie dois projetos (ou duas databases): `vitrine-imobiliaria` e `vitrine-guincho`.
2. Copie a connection string **direta** (sem `-pooler` no host), com `?sslmode=require`.
   A conexão direta é necessária para o `prisma migrate deploy`.

## 3. Rodar as migrations e o seed (no seu computador)

O seed **apaga e recria todos os dados** do banco. Por isso ele não roda no build: você roda
manualmente, uma vez por demo, apontando para o banco certo.

```bash
cd api
npm ci

# Imobiliária
DATABASE_URL="postgresql://...neon.../vitrine-imobiliaria?sslmode=require" \
CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
CLOUDINARY_FOLDER=vitrine/imobiliaria \
ADMIN_EMAIL=admin@demo.com ADMIN_PASSWORD=demo1234 \
sh -c 'npx prisma migrate deploy && npm run seed -- imobiliaria'

# Guincho
DATABASE_URL="postgresql://...neon.../vitrine-guincho?sslmode=require" \
CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
CLOUDINARY_FOLDER=vitrine/guincho \
ADMIN_EMAIL=admin@demo.com ADMIN_PASSWORD=demo1234 \
sh -c 'npx prisma migrate deploy && npm run seed -- guincho'
```

Com as chaves do Cloudinary, o seed sobe as fotos do Unsplash para a pasta da demo (por URL).
Sem elas, as fotos ficam apontando direto para o Unsplash e o upload pelo painel fica desativado.

> Variáveis passadas na linha de comando têm prioridade sobre o `api/.env` local.
> Confira o `DATABASE_URL` duas vezes antes de rodar: o seed apaga tudo.

Para resetar uma demo pública (alguém bagunçou os dados), é só rodar o seed de novo.

## 4. Render: duas APIs

1. **New → Blueprint**, escolha este repositório. O Render lê o `render.yaml` da raiz e cria
   `vitrine-api-imobiliaria` e `vitrine-api-guincho` (Root Directory `api`, health check `/saude`).
2. Preencha as variáveis marcadas como `sync: false` em cada serviço:

| Variável | Imobiliária | Guincho |
| --- | --- | --- |
| `DATABASE_URL` | URL do Neon da imobiliária | URL do Neon do guincho |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | da sua conta | da sua conta |
| `REVALIDATE_SECRET` | segredo da imobiliária (passo 0) | segredo do guincho |
| `WEB_URL` | `https://vitrine-imobiliaria.vercel.app` | `https://vitrine-guincho.vercel.app` |
| `CORS_ORIGINS` | igual ao `WEB_URL` (mais domínios separados por vírgula) | igual ao `WEB_URL` |

Se você ainda não sabe a URL da Vercel, deixe `WEB_URL` e `CORS_ORIGINS` para o passo 6.

O build roda `npm ci --include=dev && npx prisma migrate deploy && npm run build`, então novas
migrations são aplicadas a cada deploy. O seed nunca roda ali.

3. Teste: `https://vitrine-api-imobiliaria.onrender.com/saude` → `{"ok":true}` e
   `/docs` mostra o Swagger.

> O plano gratuito hiberna depois de ~15 min sem uso e leva ~50 s para acordar.
> O site continua no ar enquanto isso, porque as páginas saem do cache da Vercel.

## 5. Vercel: dois projetos do mesmo repositório

Crie dois projetos importando o mesmo repositório:

- **Root Directory:** `web`
- **Framework:** Next.js (detectado sozinho)
- **Variáveis de ambiente** (Production, e Preview se quiser):

| Variável | Imobiliária | Guincho |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://vitrine-api-imobiliaria.onrender.com` | `https://vitrine-api-guincho.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://vitrine-imobiliaria.vercel.app` | `https://vitrine-guincho.vercel.app` |
| `REVALIDATE_SECRET` | segredo da imobiliária | segredo do guincho |

As variáveis `NEXT_PUBLIC_*` entram no build. Se mudar alguma, faça um **Redeploy**.

O build não quebra se a API estiver dormindo: as páginas mostram um aviso amigável e se
atualizam sozinhas em cerca de um minuto. Para o primeiro deploy sair já com todos os itens
pré-gerados, acorde a API antes (abra `/saude`) e depois faça o deploy.

## 6. Ligar os dois lados

1. Volte no Render e confira `WEB_URL` e `CORS_ORIGINS` de cada API com o domínio final da
   Vercel (sem barra no final). Salvar reinicia o serviço.
2. Teste a revalidação: entre em `/painel/login` (`admin@demo.com` / `demo1234`), mude o título
   de um item e abra a página dele no site. A mudança aparece na primeira visita.
3. Teste o formulário de contato: o lead aparece em **Painel → Leads**. Se der erro de CORS no
   console do navegador, o `CORS_ORIGINS` não bate com o domínio do site.

## Checklist rápido

- [ ] `REVALIDATE_SECRET` igual no Render e na Vercel, por demo
- [ ] `CORS_ORIGINS` e `WEB_URL` com o domínio exato do site (https, sem barra final)
- [ ] `NEXT_PUBLIC_API_URL` apontando para a API da mesma demo
- [ ] Seed rodado em cada banco com o argumento certo (`imobiliaria` ou `guincho`)
- [ ] `CLOUDINARY_FOLDER` diferente por demo
- [ ] Domínio próprio? Adicione na Vercel e atualize `NEXT_PUBLIC_SITE_URL`, `WEB_URL` e `CORS_ORIGINS`
