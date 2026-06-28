# Decap CMS setup

This site uses Decap CMS at `/admin` to edit `src/content/siteContent.json`.

## Production checklist

1. Create or confirm the production GitHub repository.
2. Push this project to the repository's `main` branch.
3. In `public/admin/config.yml`, confirm:
   - `repo` is set to `cothme/St-Jude-Landing-Page`.
   - `repo` uses the `owner/repo` format, not the full `https://github.com/...` URL.
   - `site_url` and `display_url` point to `https://st-jude-landing-page-production.up.railway.app` or the final custom domain.
4. Configure Decap authentication for the deployed `/admin` route.
   - This site hosts its own lightweight Decap-compatible OAuth proxy from the Railway app.
   - Create a GitHub OAuth App with callback URL `https://st-jude-landing-page-production.up.railway.app/callback`.
   - Add the GitHub OAuth credentials to Railway:
     - `GITHUB_OAUTH_CLIENT_ID`
     - `GITHUB_OAUTH_CLIENT_SECRET`
   - Optional Railway variables:
     - `GITHUB_OAUTH_SCOPE=public_repo` for a public repository with invited editors only.
     - `GITHUB_OAUTH_SCOPE=repo` for private repository access. This is the runtime default.
     - `CMS_ALLOWED_ORIGINS=https://st-jude-landing-page-production.up.railway.app` to override the allowed CMS origins.
5. Give content editors write access to the GitHub repository or to a restricted GitHub team used by the OAuth provider.
   - A regular GitHub account is not enough to edit this site.
   - Keep `open_authoring` disabled unless you intentionally want outside GitHub users to submit pull requests.
   - For tighter control, keep the repository private and enable branch protection on `main`.
6. Confirm the hosting provider rebuilds the site when `main` changes.

The deployed CMS uses the GitHub backend, saves drafts through Decap's editorial workflow, and publishes by committing merged content changes back to `main`.

## Production login troubleshooting

If clicking **Login with GitHub** shows `Not Found`, confirm the deployed CMS config points at the Railway-hosted OAuth endpoint:

```yml
backend:
  name: github
  repo: cothme/St-Jude-Landing-Page
  branch: main
  base_url: https://st-jude-landing-page-production.up.railway.app
  auth_endpoint: auth
```

Also confirm the GitHub OAuth App callback URL is exactly `https://st-jude-landing-page-production.up.railway.app/callback`, and that Railway has `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` set.

Do not add `open_authoring: true` for this site. Without Open Authoring, Decap requires the signed-in GitHub user to have write access to `cothme/St-Jude-Landing-Page`.

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
