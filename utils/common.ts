export function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds))
}

export function strMatch(pattern: RegExp, target: string) {
    return pattern.test(target)
}