module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = 'https://ljbdxhavypffoelqyvuu.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const payload = req.body;
    const messageType = payload.message?.type || payload.type;

    console.log('Webhook received:', messageType);

    if (messageType === 'end-of-call-report') {
      const report = payload.message || payload;

      const transcript = report.transcript || '';
      const summary = report.summary || '';
      const callerPhone = report.customer?.number || 'Unknown';
      const duration = report.duration || 0;

      const extracted = extractCallDetails(transcript, summary);

      // Get first contractor using REST API
      const contractorRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contractors?select=id&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const contractors = await contractorRes.json();
      const contractorId = contractors?.[0]?.id;

      if (contractorId) {
        // Insert call using REST API
        const insertRes = await fetch(
          `${SUPABASE_URL}/rest/v1/calls`,
          {
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
          }
        );

        const insertData = await insertRes.json();

        if (!insertRes.ok) {
          console.error('Insert error:', insertData);
          return res.status(500).json({ error: 'Failed to save call' });
        }

        console.log('Call saved:', insertData[0]?.id);
        return res.status(200).json({ success: true, callId: insertData[0]?.id });
      } else {
        console.log('No contractor found');
        return res.status(200).json({ success: true, note: 'No contractor found' });
      }
    }

    // Acknowledge other webhook types
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function extractCallDetails(transcript, summary) {
  const text = (transcript + ' ' + summary).toLowerCase();

  let callerName = 'Unknown Caller';
  const namePatterns = [
    /my name is ([a-z]+ ?[a-z]*)/i,
    /this is ([a-z]+ ?[a-z]*)/i,
    /i'm ([a-z]+ ?[a-z]*)/i,
    /name's ([a-z]+ ?[a-z]*)/i,
  ];
  for (const pattern of namePatterns) {
    const match = transcript.match(pattern);
    if (match) {
      callerName = match[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  let serviceNeeded = 'General inquiry';
  const services = [
    { keywords: ['leak', 'leaking', 'drip'], label: 'Leak repair' },
    { keywords: ['clog', 'clogged', 'drain'], label: 'Drain/clog service' },
    { keywords: ['water heater', 'hot water'], label: 'Water heater service' },
    { keywords: ['toilet'], label: 'Toilet repair' },
    { keywords: ['pipe', 'repipe'], label: 'Pipe repair/replacement' },
    { keywords: ['faucet', 'sink'], label: 'Faucet/sink repair' },
    { keywords: ['sewer', 'sewage'], label: 'Sewer service' },
    { keywords: ['install', 'installation'], label: 'New installation' },
    { keywords: ['roof', 'roofing'], label: 'Roofing' },
    { keywords: ['remodel', 'renovation'], label: 'Remodel' },
    { keywords: ['estimate', 'quote'], label: 'Estimate request' },
    { keywords: ['hvac', 'air conditioning', 'heating'], label: 'HVAC service' },
  ];
  for (const service of services) {
    if (service.keywords.some(kw => text.includes(kw))) {
      serviceNeeded = service.label;
      break;
    }
  }

  let urgency = 'low';
  if (['emergency', 'urgent', 'flooding', 'burst', 'gas leak', 'asap'].some(kw => text.includes(kw))) {
    urgency = 'high';
  } else if (['soon', 'this week', 'not working', 'broken'].some(kw => text.includes(kw))) {
    urgency = 'medium';
  }

  let address = '';
  const addressMatch = transcript.match(/(\d+[^,\n]*(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|blvd|way|court|ct)[^,\n]*)/i);
  if (addressMatch) {
    address = addressMatch[1].trim();
  }

  return {
    callerName,
    serviceNeeded,
    urgency,
    address,
    summary: summary || `${callerName} called about ${serviceNeeded.toLowerCase()}.`,
  };
}
