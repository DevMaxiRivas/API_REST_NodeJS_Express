/**
 * Constructs the full URL from an Express request object.
 *
 * This function builds the complete URL that the client attempted to access,
 * combining the protocol, host, and original path (including query string).
 * It is typically used when generating error responses to provide clients
 * with the exact endpoint that caused the issue.
 *
 * @param {Object} req - The Express request object.
 * @param {string} req.protocol - The request protocol (e.g., `'http'` or `'https'`).
 * @param {Function} req.get - Method to retrieve request headers (e.g., `req.get('host')`).
 * @param {string} req.originalUrl - The full original URL path including query string.
 * @returns {string} The complete URL string (e.g., `'http://example.com/api/users?page=2'`).
 *
 * @example
 * // Assuming an incoming request: GET http://localhost:3000/users/42?sort=asc
 * const fullUrl = getFullUrl(req);
 * console.log(fullUrl);
 * // Output: 'http://localhost:3000/users/42?sort=asc'
 *
 * @example
 * // Using HTTPS with custom port
 * // req.protocol = 'https', req.get('host') = 'api.example.com:443', req.originalUrl = '/auth/login'
 * const fullUrl = getFullUrl(req);
 * // Returns: 'https://api.example.com:443/auth/login'
 */

export function getFullUrl(req) {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`
}
