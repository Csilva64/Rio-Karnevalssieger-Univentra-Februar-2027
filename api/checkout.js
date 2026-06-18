import Stripe from 'stripe';

const STRIPE_PRICES = {
  'macuco':           'price_1ThZ1CASOPwwexHbbIG2Gsit',
  'rafahin':          'price_1ThZ1FASOPwwexHb7b7wfS7E',
  'caboclos':         'price_1ThZ1IASOPwwexHbSwt6ku16',
  'stadtspaziergang': 'price_1ThZ1NASOPwwexHbmcPeH7Ee',
  'corcovado':        'price_1ThZ1NASOPwwexHbqfGLq3p2',
  'samba':            'price_1ThZ1OASOPwwexHbP6KyiI9D',
  'bahia-by-night':   'price_1ThZ1PASOPwwexHbyQFUTO4a',
  'cachoeira':        'price_1ThZ1QASOPwwexHb3sfaIpNX',
};

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripe) {
    return res.status(503).json({ error: 'stripe_not_configured' });
  }

  const { excursionId, origin } = req.body;
  const baseUrl = origin || 'https://vielfalt-brasiliens-gebeco.opcoia.com.br';
  const priceId = STRIPE_PRICES[excursionId];

  if (!priceId) {
    return res.status(400).json({ error: 'unknown_excursion' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/?payment=success`,
      cancel_url: `${baseUrl}/?payment=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
