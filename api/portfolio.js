export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  const ua = req.headers['user-agent'] || '';
  
  const botPatterns = /bot|crawler|spider|preview|slack|linkedin|facebook|whatsapp|telegram|discord/i;
  const isBot = botPatterns.test(ua);
  
  if (!isBot) {
    const info = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.TOKEN_A}`)
      .then(r => r.json())
      .catch(() => ({}));
    
    await fetch(process.env.URL_A, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📄 **Portfolio visit**\n🏢 Org: ${info.org || 'unknown'}\n📍 ${info.city || '?'}, ${info.country || '?'}\n🌐 IP: ${ip}\n🖥️ ${ua}`
      })
    });
  }
  
  res.redirect(302, '/');
}
