import { handleSettings } from './settings';
import { handleServers } from './servers';
import { verifyAuth } from './auth';

export async function handleApiRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Auth check
  const authCheck = verifyAuth(request);
  if (!authCheck.valid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = authCheck.userId;

  // Routes
  if (pathname.startsWith('/api/servers')) {
    return handleServers(request, env, userId);
  }

  if (pathname.startsWith('/api/settings')) {
    return handleSettings(request, env, userId);
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
