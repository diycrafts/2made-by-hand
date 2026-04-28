const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

  try {
    const body = JSON.parse(event.body);
    const amount = body.amount || 500;
    const currency = body.currency || 'usd';

    const intentParams = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    };

    // Adauga receipt_email doar daca e valid
    if (body.email && body.email.includes('@')) {
      intentParams.receipt_email = body.email;
    }

    const intent = await stripe.paymentIntents.create(intentParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ clientSecret: intent.client_secret }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
