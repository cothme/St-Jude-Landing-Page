import { readFile } from 'node:fs/promises';

const contentUrl = new URL('../src/content/siteContent.json', import.meta.url);

const placeholderRules = [
  {
    reason: 'example domain or placeholder TLD',
    pattern: /(?:\.example\b|\bexample\.(?:com|org|net|edu|ph)\b)/i,
  },
  {
    reason: 'explicit placeholder instruction',
    pattern: /\b(?:placeholder|replace (?:this|these)|add complete|change-me|dummy|lorem ipsum|todo|tbd)\b/i,
  },
  {
    reason: 'demo or unfinished integration copy',
    pattern: /\b(?:demo|ready for (?:a )?(?:backend|email integration)|your real .+ finalized)\b/i,
  },
  {
    reason: 'fake contact number',
    pattern: /(?:tel:\+?0{6,}|\+?\d?[\s-]?000[\s-]?000[\s-]?0000|123[\s-]+(?:main|sample))/i,
  },
];

function collectStringIssues(value, path = '$') {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    return placeholderRules
      .filter((rule) => rule.pattern.test(trimmed))
      .map((rule) => ({
        path,
        reason: rule.reason,
        value: trimmed,
      }));
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStringIssues(item, `${path}[${index}]`));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStringIssues(item, `${path}.${key}`));
  }

  return [];
}

function getValue(content, path) {
  return path.reduce((current, key) => current?.[key], content);
}

function collectContactIssues(content) {
  const issues = [];
  const phoneHref = getValue(content, ['site', 'contact', 'phoneHref']);
  const email = getValue(content, ['site', 'contact', 'email']);
  const emailHref = getValue(content, ['site', 'contact', 'emailHref']);

  if (typeof phoneHref === 'string' && phoneHref.trim() && !phoneHref.trim().startsWith('tel:')) {
    issues.push({
      path: '$.site.contact.phoneHref',
      reason: 'phone link must use the tel: scheme',
      value: phoneHref,
    });
  }

  if (typeof emailHref === 'string' && emailHref.trim() && !emailHref.trim().startsWith('mailto:')) {
    issues.push({
      path: '$.site.contact.emailHref',
      reason: 'email link must use the mailto: scheme',
      value: emailHref,
    });
  }

  if (typeof email === 'string' && email.trim() && typeof emailHref === 'string' && emailHref.trim()) {
    const linkedEmail = emailHref.trim().replace(/^mailto:/i, '').split('?')[0];
    if (linkedEmail.toLowerCase() !== email.trim().toLowerCase()) {
      issues.push({
        path: '$.site.contact.emailHref',
        reason: 'email link should match the displayed email address',
        value: emailHref,
      });
    }
  }

  return issues;
}

function formatIssue(issue) {
  const value = issue.value.length > 120 ? `${issue.value.slice(0, 117)}...` : issue.value;
  return `- ${issue.path}: ${issue.reason} (${JSON.stringify(value)})`;
}

const rawContent = await readFile(contentUrl, 'utf8');
const siteContent = JSON.parse(rawContent);
const issues = [...collectStringIssues(siteContent), ...collectContactIssues(siteContent)];

if (issues.length > 0) {
  console.error('Placeholder or unfinished site content was found. Fix src/content/siteContent.json before building:');
  console.error(issues.map(formatIssue).join('\n'));
  process.exit(1);
}

console.log('Site content guard passed: no placeholder or unfinished public content found.');
