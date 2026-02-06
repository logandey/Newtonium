const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ljbdxhavypffoelqyvuu.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

      const extractedData = extractCallDetails(transcript, summary);

      const { data: contractors } = await supabase
        .from('contractors')
        .select('id')
        .limit(1);

      const contractorId = contractors?.[0]?.id;

      if (contractorId) {
        const { data, error } = await supabase
          .from('calls')
          .insert({
            contractor_id: contractorId,
            caller_name: extractedData.callerName,
            caller_phone: callerPhone,
            summary: summary || extractedData.summary,
            service_needed: extractedData.serviceNeeded,
            urgency: extractedData.urgency,
            address: extractedData.address,
            transcript: transcript,
            duration_seconds: duration,
            status: 'new',
          })
          .select();

        if (error) {
          console.error('Database insert error:', error);
          return res.status(500).json({ error: 'Failed to save call' });
        }

        console.log('Call saved:', data[0]?.id);
        return res.status(200).json({ success: true, callId: data[0]?.id });
      } else {
        console.error('No contractor found');
        return res.status(200).json({ success: true, note: 'No contractor found' });
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
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
    { keywords: ['leak', 'leaking', 'drip', 'dripping'], label: 'Leak repair' },
    { keywords: ['clog', 'clogged', 'blocked', 'drain'], label: 'Drain/clog service' },
    { keywords: ['water heater', 'hot water', 'no hot water'], label: 'Water heater service' },
    { keywords: ['toilet', 'running toilet'], label: 'Toilet repair' },
    { keywords: ['pipe', 'pipes', 'repipe', 'repiping'], label: 'Pipe repair/replacement' },
    { keywords: ['faucet', 'sink'], label: 'Faucet/sink repair' },
    { keywords: ['sewer', 'sewage'], label: 'Sewer service' },
    { keywords: ['install', 'installation'], label: 'New installation' },
    { keywords: ['roof', 'roofing', 'shingle'], label: 'Roofing' },
    { keywords: ['remodel', 'renovation', 'bathroom', 'kitchen'], label: 'Remodel' },
    { keywords: ['estimate', 'quote', 'bid'], label: 'Estimate request' },
    { keywords: ['hvac', 'air conditioning', 'ac', 'heating', 'furnace'], label: 'HVAC service' },
  ];
  for (const service of services) {
    if (service.keywords.some(kw => text.includes(kw))) {
      serviceNeeded = service.label;
      break;
    }
  }

  let urgency = 'low';
  const urgentKeywords = ['emergency', 'urgent', 'flooding', 'flood', 'burst', 'gas leak', 'no water', 'sewage', 'asap', 'right away', 'today'];
  const mediumKeywords = ['soon', 'this week', 'not working', 'broken'];
  if (urgentKeywords.some(kw => text.includes(kw))) {
    urgency = 'high';
  } else if (mediumKeywords.some(kw => text.includes(kw))) {
    urgency = 'medium';
  }

  let address = '';
  const addressPattern = /(\d+[^,\n]*(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|court|ct|circle|cir|place|pl)[^,\n]*)/i;
  const addressMatch = transcript.match(addressPattern);
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
