const DASHBOARD_URL = 'https://alamerdev.github.io/nexusaidc-dashboard';

export async function handleOAuth(request, env, ctx) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${new URL(request.url).origin}/auth/callback`,
        scope: 'identify guilds',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Redirect to dashboard with token
    const redirectUrl = new URL(DASHBOARD_URL);
    redirectUrl.searchParams.set('token', tokenData.access_token);
    redirectUrl.searchParams.set('userId', userData.id);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl.toString(),
      },
    });
  } catch (error) {
    console.error('OAuth Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export function handleInviteRedirect(env) {
  const DISCORD_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&scope=bot%20applications.commands&permissions=8`;
  
  return new Response(null, {
    status: 302,
    headers: {
      'Location': DISCORD_INVITE_URL,
    },
  });
}
