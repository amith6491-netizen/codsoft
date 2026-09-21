const CASHFREE_API_BASE = 'https://sandbox.cashfree.com/pg';
const CASHFREE_API_VERSION = '2023-08-01';

function getCashfreeConfig() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const environment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
  if (environment !== 'SANDBOX') throw new Error('Only Cashfree Sandbox is supported');
  if (!clientId || !clientSecret) throw new Error('Cashfree Sandbox credentials are missing from dinedesk/.env.local');
  return { clientId, clientSecret };
}

export async function cashfreeRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { clientId, clientSecret } = getCashfreeConfig();
  const response = await fetch(`${CASHFREE_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': CASHFREE_API_VERSION,
      'x-client-id': clientId,
      'x-client-secret': clientSecret,
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    console.error('Cashfree API error:', response.status, data);
    throw new Error('Cashfree API request failed');
  }
  return data as T;
}

export function isCashfreeConfigured() {
  return process.env.CASHFREE_ENVIRONMENT !== 'PRODUCTION' && Boolean(process.env.CASHFREE_CLIENT_ID && process.env.CASHFREE_CLIENT_SECRET);
}

export function getCashfreeWebhookSecret() {
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!secret) throw new Error('Cashfree is not configured');
  return secret;
}