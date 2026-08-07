# derrydean.com — site source

Static site, no build step. Every page is plain HTML linking to `css/style.css` and `js/main.js`, with images and icons in `assets/`.

## Deploying on Cloudflare Pages

- **Framework preset**: None
- **Build command**: (leave blank)
- **Build output directory**: `/` (the repo root)

That's the whole configuration. Push to `main`, connect the repo in Cloudflare Pages, and every push after that deploys automatically.

## Before or shortly after going live

- **Contact form (`work-with-me.html` → "Submit a Brief or RFP")**: currently falls back to a pre-filled email draft because no Web3Forms key is set. To enable real in-browser submission, get a free key at web3forms.com and paste it into `js/main.js`, replacing `YOUR_WEB3FORMS_ACCESS_KEY`.
- **Booking buttons (`work-with-me.html`)**: the $500 Strategy Call and $1,000 Advisory Session buttons currently route to a pre-filled contact form. Once the Google Calendar Appointment Schedule booking pages exist, swap those two `href`s to the real booking URLs.
- **`_redirects`**: already set up for the two real inbound URLs from the old WordPress site (`/privacy-policy/`, `/terms-and-conditions/`). Cloudflare Pages reads this file automatically, no extra config needed.

## Not in this repo

`mockups/` (the self-contained, single-file versions used for chat preview and local click-through) and `brand-src/` (raw logo source files) are intentionally excluded, neither is needed to run the live site.
