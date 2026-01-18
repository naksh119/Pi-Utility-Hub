import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { paymentId, txid } = JSON.parse(event.body || "{}");
    const API_KEY = process.env.PI_API_KEY;

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error: PI_API_KEY missing" })
        };
    }

    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: "POST",
            headers: {
                "Authorization": `Key ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ txid }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Pi API Error", detail: errorData })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", detail: String(error) })
        };
    }
};

export { handler };
