# Publish Inversion Excursion on the custom domain

Target application: `inversion-labs-world.pages.dev`
Intended apex domain: `inversionexcursion.online`

## Current verified state — 2026-07-20

- The Cloudflare Pages project lists only `inversion-labs-world.pages.dev`.
- `inversionexcursion.online` delegates DNS to `launch1.spaceship.net` and `launch2.spaceship.net`.
- The apex has no A/AAAA answer and `www` has no CNAME answer from the current resolver.
- The custom domain must not be used as the canonical URL or redirect target yet.

## Attach the apex domain

1. In Cloudflare, add `inversionexcursion.online` as a website/zone in the same account that owns the `inversion-labs-world` Pages project.
2. Cloudflare will display two authoritative nameservers for this specific zone. Copy those exact values; do not substitute generic Cloudflare nameservers.
3. In Spaceship, open the domain's DNS/nameserver settings, choose custom nameservers, and replace `launch1.spaceship.net` and `launch2.spaceship.net` with the two nameservers Cloudflare assigned in step 2.
4. Wait until the zone shows **Active** in Cloudflare. DNS delegation can take time to propagate.
5. In Cloudflare, go to **Workers & Pages → inversion-labs-world → Custom domains → Set up a domain**.
6. Enter `inversionexcursion.online` and continue. For an active apex zone, Cloudflare Pages creates the required DNS record and certificate workflow.
7. Add `www.inversionexcursion.online` through the same **Custom domains** screen if `www` should also serve or redirect to the site. Do not create only a manual CNAME without first associating the hostname with Pages.

## Verify before switching canonical URLs

Run these checks and require successful results:

```bash
dig +short inversionexcursion.online NS
dig +short inversionexcursion.online A
dig +short www.inversionexcursion.online CNAME
curl -fsSIL https://inversionexcursion.online/
curl -fsSL https://inversionexcursion.online/DEPLOYED_COMMIT.txt
```

The response must have a valid TLS certificate, serve this application rather than a registrar page, and expose the expected deployed commit.

## Promote the domain after verification

Only after the checks above pass:

1. Replace the Pages origin with `https://inversionexcursion.online/` in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.
2. Add a Pages/Bulk Redirect from `https://inversion-labs-world.pages.dev/*` to `https://inversionexcursion.online/:splat`, preserving paths and query strings.
3. Configure `www` to redirect to the apex through Cloudflare after `www` is attached and its certificate is active.
4. Build, deploy, and repeat the HTTPS and deployed-commit checks against both hostnames.

Do not redirect the working Pages hostname before the custom domain is active; that would strand visitors on an unreachable target.
