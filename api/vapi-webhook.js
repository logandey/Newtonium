module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    // Debug mode for GET requests
    const SUPABASE_URL = 'https://ljbdxhavypffoelqyvuu.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    try {
      const testRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contractors?select=id&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const testBody = await testRes.text();
      
      return res.status(200).json({
        debug: true,
        supabaseStatus: testRes.status,
        supabaseResponse: testBody,
        keyPrefix: SUPABASE_KEY ? SUPABASE_KEY.substring(0, 20) + '...' : 'MISSING',
      });
    } catch (err) {
      return res.status(200).json({ debug: true, error: err.message });
    }
  }

  const SUPABASE_URL = 'https://ljbdxhavypffoelqyvuu.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const payload = req.body;
    const messageType = payload.message?.type || payload.type;

    if (messageType === 'end-of-call-report') {
      const report = payload.message || payload;
      const transcript = report.transcript || '';
      const summary = report.summary || '';
      const callerPhone = report.customer?.number || 'Unknown';
      const duration = report.duration || 0;
      const extracted = extractCallDetails(transcript, summary);

      const contractorRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contractors?select=id&limit=1`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      );
      const contractors = await contractorRes.json();
      const contractorId = contractors?.[0]?.id;

      if (!contractorId) {
        return res.status(200).json({ success: true, note: 'No contractor found', status: contractorRes.status });
      }

      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/calls`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          contractor_id: contractorId,
          caller_name: extracted.callerName,
          caller_phone: callerPhone,
          summary: summary || extracted.summary,
          service_needed: extracted.serviceNeeded,
          urgency: extracted.urgency,
          address: extracted.address,
          transcript: transcript,
          duration_seconds: duration,
          status: 'new',
        }),
      });
      const insertData = await insertRes.json();
      if (!insertRes.ok) return res.status(500).json({ error: 'Insert failed', details: insertData });
      return res.status(200).json({ success: true, callId: insertData[0]?.id });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

function extractCallDetails(transcript, summary) {
  const text = (transcript + ' ' + summary).toLowerCase();
  let callerName = 'Unknown Caller';
  for (const p of [/my name is ([a-z]+ ?[a-z]*)/i, /this is ([a-z]+ ?[a-z]*)/i, /i'm ([a-z]+ ?[a-z]*)/i]) {
    const m = transcript.match(p);
    if (m) { callerName = m[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); break; }
  }
  let serviceNeeded = 'General inquiry';
  for (const s of [
    { k: ['leak', 'leaking'], l: 'Leak repair' }, { k: ['clog', 'drain'], l: 'Drain/clog service' },
    { k: ['water heater'], l: 'Water heater service' }, { k: ['pipe', 'repipe'], l: 'Pipe repair' },
    { k: ['roof'], l: 'Roofing' }, { k: ['estimate', 'quote'], l: 'Estimate request' },
  ]) { if (s.k.some(kw => text.includes(kw))) { serviceNeeded = s.l; break; } }
  let urgency = 'low';
  if (['emergency', 'urgent', 'flooding', 'burst'].some(kw => text.includes(kw))) urgency = 'high';
  else if (['soon', 'this week', 'broken'].some(kw => text.includes(kw))) urgency = 'medium';
  let address = '';
  const am = transcript.match(/(\d+[^,\n]*(?:street|st|ave|rd|drive|dr|blvd|way|ct)[^,\n]*)/i);
  if (am) address = am[1].trim();
  return { callerName, serviceNeeded, urgency, address, summary: summary || `${callerName} called about ${serviceNeeded.toLowerCase()}.` };
}
