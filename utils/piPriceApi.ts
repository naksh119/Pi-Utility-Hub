
/**
 * Pi Network Price API Utility
 * Fetches real-time price and historical chart data from CoinGecko
 */

export interface PiPriceData {
    usd: number;
    inr: number;
    usd_24h_change: number;
    last_updated: number;
}

export interface ChartPoint {
    time: string;
    price: number;
}

/**
 * Fetches current price data for Pi Network (IOU)
 */
export async function fetchCurrentPiPrice(): Promise<PiPriceData | null> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd,inr&include_24hr_change=true'
        );
        if (!response.ok) throw new Error('Failed to fetch price');
        const data = await response.json();

        if (data['pi-network']) {
            return {
                usd: data['pi-network'].usd,
                inr: data['pi-network'].inr,
                usd_24h_change: data['pi-network'].usd_24h_change,
                last_updated: Date.now()
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching Pi Price:', error);
        return null;
    }
}

/**
 * Fetches historical price data for charting
 * @param days - Number of days of history (max 365)
 */
export async function fetchPiPriceHistory(days: number = 7): Promise<ChartPoint[]> {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/pi-network/market_chart?vs_currency=usd&days=${days}`
        );
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();

        if (data.prices && Array.isArray(data.prices)) {
            return data.prices.map((point: [number, number]) => ({
                time: new Date(point[0]).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                price: Number(point[1].toFixed(2))
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching Pi History:', error);
        return [];
    }
}
