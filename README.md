# Pledge App (MVP) — Fail → Auto Charge to Supervisor

This is a minimal **Next.js 14 (App Router, TypeScript)** + **Prisma (PostgreSQL)** + **Stripe (SetupIntent + PaymentIntent + Connect)** MVP.
Users create a pledge (amount, deadline, supervisor). On deadline:
- If success (user uploads evidence & supervisor confirms): **no charge**.
- If fail / no confirm within grace window: **charge user** and **transfer to supervisor's Stripe Connect account**.

> **Assumptions (you can change at any time)**  
> - Payments: **Stripe** (no custody), currency **USD**, default amount **$100**  
> - Supervisor confirm mode: **NEEDS_CONFIRM** (24h grace; timeout → fail)  
> - Deploy: **Vercel** + **Supabase**  

## Quickstart

### 1) Prerequisites
- Node.js 20+
- pnpm or npm
- PostgreSQL (or Supabase)
- Stripe account (standard) + Connect enabled

### 2) Clone & Install
```bash
pnpm install
# or: npm i
```

### 3) Configure env
Copy `.env.example` → `.env` and fill values.

### 4) Init DB
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5) Dev
```bash
pnpm dev
# or: npm run dev
```
Visit http://localhost:3000

### 6) Stripe webhook (local)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Put the printed signing secret into `STRIPE_WEBHOOK_SECRET`.

## Project Structure
```
/app           # Next.js App Router
  /(marketing)
  /(dashboard)
  /api
/lib           # db/auth/stripe helpers
/prisma        # Prisma schema
```

## Minimal Flows
- Create pledge → SetupIntent to **save payment method** → invite supervisor to **Connect onboarding**.
- Deadline cron checks `PENDING` pledges:
  - NEEDS_CONFIRM: email supervisor for decision; timeout → fail
  - AUTO_FAIL: fail directly
  - AUTO_PASS: success directly
- Fail: create PaymentIntent to charge user → Transfer to supervisor's Connect account.
- All key steps recorded in `AuditLog`.

## Notes
- **This is an MVP**: routes and components are intentionally simple, with TODOs where production hardening is needed (auth, rate limits, retries/backoff, idempotency keys, etc.).
- You **do not** hold user funds (no custody). You only save a payment method and charge on failure.

## License
MIT


---

## 🚀 One‑Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourname/pledge-app&project-name=pledge-app&repository-name=pledge-app&root-directory=&install-command=npm%20i&build-command=npm%20run%20build&output-directory=.&framework=nextjs)

> 上面按钮里的 `repository-url` 请改成你的 GitHub 仓库地址（例如 `https://github.com/lekbuss/-`）。

### Required Environment Variables (Vercel → Settings → Environment Variables)
| Key | Example | Notes |
|-----|---------|-------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/pledge` | Supabase/Neon 均可 |
| `STRIPE_SECRET_KEY` | `sk_test_xxx` | Stripe Secret（测试/生产） |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_xxx` | 前端可见 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | `stripe listen` 时生成 |
| `RESEND_API_KEY` | `re_xxx` | 可选（邮件） |
| `APP_BASE_URL` | `https://your-vercel-domain.vercel.app` | 用于生成链接 |
| `CRON_SECRET` | `your-strong-secret` | 调用 `/api/jobs/settle` 的签名 |

### Scheduled Job (Vercel Cron)
这个项目已包含 `vercel.json`，会每小时触发一次 `/api/jobs/settle`。你可在 Vercel Dashboard 里改为更细的频率。

### Stripe Webhook (Production)
1. 在 Stripe Dashboard 添加 endpoint：`https://your-vercel-domain.vercel.app/api/stripe/webhook`  
2. 把签名密钥填进 `STRIPE_WEBHOOK_SECRET`  
3. 需在 webhook 里处理：`setup_intent.succeeded`（保存 payment_method 到 DB）与 `payment_intent.succeeded`（标记 CHARGED 并创建 transfer）

> 当前仓库为 **MVP**，你需要根据业务把 webhook 和结算逻辑补完（代码已有 TODO）。
