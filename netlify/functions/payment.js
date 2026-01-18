// Native fetch is available in Node 18+

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { action, paymentId, txid } = JSON.parse(event.body);
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
        console.error('PI_API_KEY is not set');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error' })
        };
    }

    try {
        let url = '';
        if (action === 'approve') {
            url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
        } else if (action === 'complete') {
            url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
        } else {
            return { statusCode: 400, body: 'Invalid action' };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: action === 'complete' ? JSON.stringify({ txid }) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`Pi API Error (${action}):`, data);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || 'Pi API error' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Payment function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
