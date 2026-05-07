export function maskEmail(email) {
    if (!email || !email.includes('@')) return email

    // Example: m****@domain.com
    return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => {
        return a + '****' + c
    })
}