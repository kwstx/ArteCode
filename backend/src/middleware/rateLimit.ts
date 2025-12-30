/**
 * Rate Limiting Middleware
 * 
 * Protects Gemini API free tier limits:
 * - 60 requests per minute (RPM)
 * - 1500 requests per day (RPD)
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

interface DailyQuotaStore {
    count: number;
    resetTime: number;
}

// In-memory stores (use Redis in production)
const rateLimitStore: RateLimitStore = {};
const dailyQuotaStore: DailyQuotaStore = {
    count: 0,
    resetTime: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
};

/**
 * Get client identifier (IP address)
 */
function getClientId(req: any): string {
    return req.ip || req.connection.remoteAddress || 'unknown';
}

/**
 * Per-IP rate limiting middleware
 * Limits: 50 requests per minute per IP (below Gemini's 60 RPM limit)
 */
export function rateLimitMiddleware(req: any, res: any, next: any) {
    const clientId = getClientId(req);
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'); // 1 minute
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50');

    // Initialize or get client's rate limit data
    if (!rateLimitStore[clientId] || now > rateLimitStore[clientId].resetTime) {
        rateLimitStore[clientId] = {
            count: 0,
            resetTime: now + windowMs
        };
    }

    const clientData = rateLimitStore[clientId];

    // Check if limit exceeded
    if (clientData.count >= maxRequests) {
        const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
        res.status(429).json({
            error: 'Rate limit exceeded',
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
            retryAfter
        });
        return;
    }

    // Increment counter
    clientData.count++;

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - clientData.count);
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

    next();
}

/**
 * Daily quota middleware
 * Limits: 1000 requests per day (below Gemini's 1500 RPD limit)
 */
export function dailyQuotaMiddleware(req: any, res: any, next: any) {
    const now = Date.now();
    const dailyLimit = parseInt(process.env.DAILY_QUOTA || '1000');

    // Reset daily quota if needed
    if (now > dailyQuotaStore.resetTime) {
        dailyQuotaStore.count = 0;
        dailyQuotaStore.resetTime = now + 24 * 60 * 60 * 1000;
    }

    // Check if daily quota exceeded
    if (dailyQuotaStore.count >= dailyLimit) {
        const resetTime = new Date(dailyQuotaStore.resetTime);
        res.status(429).json({
            error: 'Daily quota exceeded',
            message: `Daily API quota reached. Resets at ${resetTime.toLocaleTimeString()}.`,
            resetTime: resetTime.toISOString()
        });
        return;
    }

    // Increment daily counter
    dailyQuotaStore.count++;

    // Add quota headers
    res.setHeader('X-Daily-Quota-Limit', dailyLimit);
    res.setHeader('X-Daily-Quota-Remaining', dailyLimit - dailyQuotaStore.count);
    res.setHeader('X-Daily-Quota-Reset', new Date(dailyQuotaStore.resetTime).toISOString());

    next();
}

/**
 * Get current usage statistics
 */
export function getUsageStats() {
    const now = Date.now();
    const activeClients = Object.keys(rateLimitStore).filter(
        (key) => now <= rateLimitStore[key].resetTime
    ).length;

    return {
        dailyQuota: {
            used: dailyQuotaStore.count,
            limit: parseInt(process.env.DAILY_QUOTA || '1000'),
            remaining: parseInt(process.env.DAILY_QUOTA || '1000') - dailyQuotaStore.count,
            resetTime: new Date(dailyQuotaStore.resetTime).toISOString()
        },
        activeClients,
        rateLimitWindow: `${parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') / 1000}s`,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50')
    };
}

/**
 * Clean up old rate limit entries (run periodically)
 */
export function cleanupRateLimitStore() {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach((key) => {
        if (now > rateLimitStore[key].resetTime) {
            delete rateLimitStore[key];
        }
    });
}

// Clean up every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
