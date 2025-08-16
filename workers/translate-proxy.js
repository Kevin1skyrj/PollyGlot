export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/translate')) {
      return new Response('Not found', { status: 404 });
    }

    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const { text, targetLanguage } = body ?? {};
    if (!text || !targetLanguage) {
      return new Response(JSON.stringify({ error: 'text and targetLanguage required' }), { status: 400 });
    }

    // Use AI variable name as set in Cloudflare
    const apiKey = env.AI;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server misconfigured: no API key' }), { status: 500 });
    }

    // Use the same model/endpoint as your current client code
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translation, no explanations:\n\n"${text}"`;

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000,
          }
        })
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        return new Response(JSON.stringify({ error: 'Gemini API error', details: errorData.error?.message || 'Request failed' }), { status: resp.status });
      }

      const data = await resp.json();
      const translated = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (!translated) {
        return new Response(JSON.stringify({ error: 'No translation received from Gemini' }), { status: 500 });
      }

      return new Response(JSON.stringify({ translated }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Server error', details: String(err) }), { status: 502 });
    }
  }
}
