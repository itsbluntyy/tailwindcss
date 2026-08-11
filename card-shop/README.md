# The Card Vault — Pokémon card shop

A complete e-commerce site for reselling Pokémon cards. Next.js (App Router) +
Tailwind CSS + Prisma/SQLite + Stripe Checkout, designed to run **free** on
Vercel with a free Turso database.

**Storefront:** homepage with featured/recent cards, browse page with search +
filters (set, rarity, condition, price range, sort), card detail pages with a
multi-photo gallery, cart, and Stripe Checkout. Mobile-first, dark navy/gold.

**Admin (`/admin`, password protected):** add/edit/delete listings with photo
upload, mark cards sold (with actual sold price), relist, and a profit tracker
(what you paid vs. what it sold for).

---

## 1. Run it locally (5 minutes)

```bash
cd card-shop
npm install
cp .env.example .env          # then edit .env — see below
npm run setup                 # creates dev.db and seeds 10 example cards
npm run dev                   # http://localhost:3000
```

In `.env`, set at minimum:

| Variable | What to put there |
| --- | --- |
| `DATABASE_URL` | leave as `file:./dev.db` |
| `ADMIN_PASSWORD` | your admin password |
| `AUTH_SECRET` | any long random string (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY` | your Stripe **test** key (`sk_test_…`) — see §3 |

- Storefront: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (log in with `ADMIN_PASSWORD`)

The seed creates 10 realistic cards (2 already sold so the profit tracker has
data) with generated placeholder images — replace them with real photos from
the admin's Edit page.

## 2. Set up Stripe test mode

1. Create a free account at <https://dashboard.stripe.com/register>.
2. Make sure the **Test mode** toggle (top right of the dashboard) is ON.
3. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_…`)
   into `STRIPE_SECRET_KEY`.
4. Restart `npm run dev`, add a card to the cart, and hit **Checkout with
   Stripe**. Pay with Stripe's test card:
   - Card number: `4242 4242 4242 4242`
   - Any future expiry, any CVC, any name/ZIP.
5. After paying you land on the order-confirmation page and the card is
   automatically marked **Sold** (visible in the admin profit tracker).

When you're ready for real money, flip the Stripe dashboard to **Live mode**,
complete Stripe's activation form (business + bank details), and swap
`STRIPE_SECRET_KEY` for the `sk_live_…` key. Nothing else changes.

## 3. Create the free production database (Turso)

Vercel's filesystem is ephemeral, so the production database is
[Turso](https://turso.tech) — SQLite hosted for free (the free plan is far more
than a card shop needs). The app automatically uses Turso whenever
`TURSO_DATABASE_URL` is set, and the local file otherwise.

```bash
# install the Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash
turso auth signup                # opens browser; free account

turso db create card-shop
turso db show card-shop --url    # -> TURSO_DATABASE_URL
turso db tokens create card-shop # -> TURSO_AUTH_TOKEN

# create the tables (generates SQL from the Prisma schema and applies it)
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > /tmp/schema.sql
turso db shell card-shop < /tmp/schema.sql

# optional: seed the production DB with the 10 example cards
TURSO_DATABASE_URL="libsql://…" TURSO_AUTH_TOKEN="…" npm run db:seed
```

(If you later change `prisma/schema.prisma`, repeat the `migrate diff` step
with `--from-schema-datasource` pointing at the old state, or simply generate
the diff SQL and apply it via `turso db shell`.)

## 4. Deploy to Vercel (free)

1. Push this repository to GitHub (already done if you're reading this on
   GitHub).
2. Go to <https://vercel.com/new>, sign in with GitHub, and **Import** this
   repository.
3. **Important:** set **Root Directory** to `card-shop` (Edit → select the
   folder). Vercel will auto-detect Next.js.
4. Under **Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `TURSO_DATABASE_URL` | `libsql://…` from §3 |
   | `TURSO_AUTH_TOKEN` | token from §3 |
   | `ADMIN_PASSWORD` | your admin password |
   | `AUTH_SECRET` | a long random string |
   | `STRIPE_SECRET_KEY` | `sk_test_…` (swap to `sk_live_…` when going live) |

5. Click **Deploy**. Your shop is live at `https://<project>.vercel.app`.

Free-tier notes: Vercel Hobby + Turso free tier + Stripe (pay-per-transaction
only, no monthly fee) = $0/month fixed costs. Card photos are stored inside the
database itself, so there's no image-hosting bill either — just keep uploads
reasonable (a few hundred KB per photo; the upload form enforces ~3.5 MB per
save).

## 5. Recommended: Stripe webhook (production)

The success page already marks cards sold when the buyer returns from Stripe,
but a webhook makes it bulletproof (covers buyers who close the tab):

1. Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://<your-domain>/api/stripe-webhook`
3. Event: `checkout.session.completed`.
4. Copy the **Signing secret** (`whsec_…`) into a `STRIPE_WEBHOOK_SECRET`
   environment variable on Vercel and redeploy.

## 6. Getting free traffic (how this becomes profitable)

The whole stack is $0/month, so every dollar of margin on a card is profit.
The missing ingredient is buyers, and the free way to get them is search and
social — no ad spend required. The site ships with the SEO plumbing already
built in:

- **`/sitemap.xml`** — auto-generated, lists every available card.
- **`/robots.txt`** — lets crawlers in, keeps them out of admin/cart/API
  (except card photos, which stay crawlable for Google Images).
- **Per-card SEO titles, descriptions, and social preview images** — links you
  share on Discord/Reddit/X unfurl with the card photo and price.
- **schema.org Product markup** on every card page — this makes listings
  eligible for Google's **free** product results and rich snippets (price +
  in-stock badge directly in search results).

Do these once after deploying (all free):

1. Set `NEXT_PUBLIC_SITE_URL` on Vercel to your real URL and redeploy.
2. **Google Search Console** (<https://search.google.com/search-console>):
   verify your domain and submit `https://<your-site>/sitemap.xml`. This is
   the single highest-leverage free step.
3. **Bing Webmaster Tools** — same thing, five minutes, also free.
4. Write real descriptions on your listings (the admin Edit page). "PSA 9
   Umbreon VMAX Alt Art, cert #12345678, minor whitening on back" ranks and
   converts far better than an empty field.

Free channels that actually sell cards:

- **Reddit** (r/pkmntcgtrades and similar) and **Discord** TCG servers — share
  the card page link; the preview image/price unfurl does the selling.
- **Instagram/TikTok** — short videos of new pickups with the site link in bio
  is how most small card shops get their first regulars.
- **Local Facebook groups / card show contacts** — point repeat buyers at the
  site so you keep 100% of the sale instead of paying eBay ~13%.

Honest math: profit = (sale price − what you paid − Stripe's ~2.9% + 30¢ −
shipping). Compared with selling the same cards on eBay, you're saving roughly
10% in fees on every sale, which for most resellers *is* the profit margin.

## Day-to-day selling

- **Add a listing:** `/admin` → *+ Add card* → fill in details, upload phone
  photos, set price and what you paid.
- **Feature a card** on the homepage with the “Feature on the homepage”
  checkbox.
- **Online sales** mark themselves sold automatically at the listed price.
- **Sales made elsewhere** (eBay, in person): dashboard → *Mark sold*, entering
  the actual sold price so the profit tracker stays accurate.
- **Profit tracker** on the dashboard shows paid vs. sold and running totals.

## Notes & limits (kept simple on purpose)

- Single admin user, password via env var — no user accounts table to manage.
- Each listing is one physical card (quantity 1). Checkout doesn't place a
  hold, so in the rare case two people buy the same card simultaneously,
  refund the later payment from the Stripe dashboard.
- Shipping is not charged at checkout; add a flat `shipping_options` entry in
  `src/app/api/checkout/route.ts` if you want to charge for it.
