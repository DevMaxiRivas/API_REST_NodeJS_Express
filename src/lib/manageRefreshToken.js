export function addTokenToList(tokens, token) {
    if (!tokens) {
        return [token]
    }

    tokens.push(token)
    return tokens
}

export function removeTokenFromList(tokens, token) {
    if (!tokens) {
        return []
    }

    return tokens.filter(t => t !== token)
}
