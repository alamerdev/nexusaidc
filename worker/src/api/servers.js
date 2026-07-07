export async function handleServers(request, env, userId) {
  if (request.method === 'GET') {
    try {
      // Fetch user guilds from Discord
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
      });

      const guilds = await guildsResponse.json();

      // Filter for admin guilds
      const adminGuilds = guilds.filter(g => {
        const permissions = BigInt(g.permissions);
        return (permissions & BigInt(0x8)) === BigInt(0x8); // ADMINISTRATOR
      });

      return new Response(JSON.stringify({ servers: adminGuilds }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
