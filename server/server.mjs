import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.env.PORT || 8080);
const distDir = resolve(process.env.STATIC_DIR || 'dist');
const siteUrl = trimTrailingSlash(process.env.SITE_URL || 'https://st-jude-landing-page-production.up.railway.app');
const oauthClientId = process.env.GITHUB_OAUTH_CLIENT_ID || process.env.OAUTH_CLIENT_ID;
const oauthClientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET;
const authScope = process.env.GITHUB_OAUTH_SCOPE || process.env.OAUTH_SCOPE || 'repo';
const allowedOrigins = buildAllowedOrigins();

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', requestBaseUrl(request));

    if (request.method === 'GET' && url.pathname === '/auth') {
      handleAuth(request, response);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/callback') {
      await handleCallback(request, response, url);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/healthz') {
      sendText(response, 200, 'ok');
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendText(response, 405, 'Method Not Allowed');
      return;
    }

    serveStatic(request, response, url.pathname);
  } catch (error) {
    console.error(error);
    sendText(response, 500, 'Internal Server Error');
  }
}).listen(port, () => {
  console.log(`St. Jude site server listening on port ${port}`);
});

function handleAuth(request, response) {
  if (!oauthClientId || !oauthClientSecret) {
    sendText(response, 500, 'GitHub OAuth is not configured.');
    return;
  }

  const state = randomBytes(24).toString('hex');
  const callbackUrl = `${publicBaseUrl(request)}/callback`;
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', oauthClientId);
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizeUrl.searchParams.set('scope', authScope);
  authorizeUrl.searchParams.set('state', state);

  response.writeHead(302, {
    Location: authorizeUrl.toString(),
    'Set-Cookie': buildStateCookie(state, request),
    'Cache-Control': 'no-store',
  });
  response.end();
}

async function handleCallback(request, response, url) {
  if (!oauthClientId || !oauthClientSecret) {
    sendOAuthScript(response, 'error', { error: 'GitHub OAuth is not configured.' });
    return;
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = readCookie(request, 'cms_oauth_state');

  if (!code || !state || !savedState || !safeEqual(state, savedState)) {
    sendOAuthScript(response, 'error', { error: 'Invalid OAuth state.' });
    return;
  }

  const callbackUrl = `${publicBaseUrl(request)}/callback`;
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'st-jude-decap-cms',
    },
    body: JSON.stringify({
      client_id: oauthClientId,
      client_secret: oauthClientSecret,
      code,
      redirect_uri: callbackUrl,
      state,
    }),
  });

  const tokenPayload = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    sendOAuthScript(response, 'error', {
      error: tokenPayload.error_description || tokenPayload.error || 'GitHub token exchange failed.',
    });
    return;
  }

  response.setHeader('Set-Cookie', expireStateCookie(request));
  sendOAuthScript(response, 'success', {
    token: tokenPayload.access_token,
    provider: 'github',
  });
}

function sendOAuthScript(response, status, content) {
  const message = JSON.stringify(content);
  const origins = JSON.stringify([...allowedOrigins]);
  const script = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>GitHub Login</title></head>
  <body>
    <script>
      (function () {
        var allowedOrigins = new Set(${origins});
        function receiveMessage(event) {
          if (!allowedOrigins.has(event.origin)) {
            return;
          }
          window.opener.postMessage('authorization:github:${status}:${message}', event.origin);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(script);
}

function serveStatic(request, response, pathname) {
  let safePathname = decodeURIComponent(pathname);

  if (safePathname === '/admin') {
    response.writeHead(308, { Location: '/admin/' });
    response.end();
    return;
  }

  if (safePathname === '/admin/') {
    safePathname = '/admin/index.html';
  }

  const requestedPath = resolve(join(distDir, normalize(safePathname)));
  const filePath = requestedPath.startsWith(distDir) && existsSync(requestedPath) && statSync(requestedPath).isFile()
    ? requestedPath
    : join(distDir, 'index.html');

  const extension = extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': mimeTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

function requestBaseUrl(request) {
  return `${forwardedProto(request)}://${request.headers.host || 'localhost'}`;
}

function publicBaseUrl(request) {
  return trimTrailingSlash(process.env.OAUTH_REDIRECT_BASE_URL || process.env.SITE_URL || requestBaseUrl(request));
}

function forwardedProto(request) {
  return String(request.headers['x-forwarded-proto'] || '').split(',')[0] || 'http';
}

function buildAllowedOrigins() {
  const configured = (process.env.CMS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured.length) return new Set(configured.map(normalizeOrigin));

  return new Set([
    normalizeOrigin(siteUrl),
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);
}

function normalizeOrigin(origin) {
  return new URL(origin).origin;
}

function buildStateCookie(state, request) {
  const secure = forwardedProto(request) === 'https' ? '; Secure' : '';
  return `cms_oauth_state=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600${secure}`;
}

function expireStateCookie(request) {
  const secure = forwardedProto(request) === 'https' ? '; Secure' : '';
  return `cms_oauth_state=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

function readCookie(request, name) {
  const cookies = String(request.headers.cookie || '').split(';');
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key === name) return valueParts.join('=');
  }
  return '';
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(createHash('sha256').update(left).digest('hex'));
  const rightBuffer = Buffer.from(createHash('sha256').update(right).digest('hex'));
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function sendText(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(body);
}
