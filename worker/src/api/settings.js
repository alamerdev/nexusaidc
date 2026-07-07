export async function handleSettings(request, env, userId) {
  const url = new URL(request.url);
  const serverId = url.pathname.split('/').pop();

  if (request.method === 'GET') {
    try {
      // Get from KV storage
      const key = `server_${serverId}_settings`;
      const data = await env.NEXUS_KV.get(key);
      
      if (!data) {
        return new Response(JSON.stringify({
          language: 'de',
          aiChannel: null,
          personality: 'Du bist NexusAI, ein freundlicher und hilfsbereiter KI-Assistent.',
          autoReply: false,
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(data, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const key = `server_${serverId}_settings`;
      
      await env.NEXUS_KV.put(key, JSON.stringify(body));

      return new Response(JSON.stringify({ success: true }), {
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
