import { handleOAuth, handleInviteRedirect } from './oauth';
import { handleApiRequest } from './api/router';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // OAuth Callback
    if (pathname === '/auth/callback') {
      return handleOAuth(request, env, ctx);
    }

    // Invite Redirect
    if (pathname === '/invite') {
      return handleInviteRedirect(env);
    }

    // API Routes
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
