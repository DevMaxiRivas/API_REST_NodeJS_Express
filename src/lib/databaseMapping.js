export function arrayToString(array) {
    if (!array) {
        return ''
    }

    const json = JSON.stringify(array)
    return json.replace('[', '{').replace(']', '}')
}

