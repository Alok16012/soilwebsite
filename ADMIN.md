# SOIL Website Admin

The site has a custom admin panel at `/admin/`.

Default password: `admin123`

## Netlify Setup

Add these environment variables in Netlify:

- `GITHUB_TOKEN`: a GitHub fine-grained token with contents read/write access to this repository
- `ADMIN_PASSWORD`: optional, defaults to `admin123`
- `GITHUB_REPO`: optional, defaults to `Alok16012/soilwebsite`
- `GITHUB_BRANCH`: optional, defaults to `main`

The admin saves `data/site-content.json` and uploaded images directly to GitHub, then Netlify redeploys the site.
