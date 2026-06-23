# Decap CMS setup

This site uses Decap CMS at `/admin` to edit `src/content/siteContent.json`.

## Production checklist

1. Create or confirm the production GitHub repository.
2. Push this project to the repository's `main` branch.
3. In `public/admin/config.yml`, replace:
   - `OWNER/st-judes-official-website` with the real `owner/repo` value.
   - `https://www.stjudes.example` with the deployed website URL.
4. Configure Decap authentication for the deployed `/admin` route.
   - If the site is hosted on Netlify, use Netlify's GitHub OAuth service and add `base_url: https://api.netlify.com` under `backend`.
   - If the site is hosted elsewhere, connect a Decap-compatible GitHub OAuth provider and set its `base_url` and, when required, `auth_endpoint` under `backend`.
5. Give content editors write access to the GitHub repository or to the GitHub team used by the OAuth provider.
6. Confirm the hosting provider rebuilds the site when `main` changes.

The deployed CMS uses the GitHub backend, saves drafts through Decap's editorial workflow, and publishes by committing merged content changes back to `main`.

## Local editing

1. Start the Vite app:

   ```powershell
   npm.cmd run dev
   ```

2. In another terminal, start the Decap local proxy:

   ```powershell
   npm.cmd run cms:local
   ```

3. Open `/admin` on the Vite dev server.

`local_backend: true` in `public/admin/config.yml` lets Decap write to local files only when the admin is opened from localhost. Production uses the GitHub backend instead.

## Content and media

- Main editable content: `src/content/siteContent.json`
- Uploaded media folder: `public/uploads`
- Public uploaded media path: `/uploads`
- Existing static assets, such as `/stjude-logo.png`, remain available from `public/`

Keep `public/uploads/.gitkeep` in the repo so the upload directory exists before the first CMS media upload.
