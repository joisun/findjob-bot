export function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds))
}

export function strMatch(pattern: RegExp, target: string) {
    return pattern.test(target)
}

export function debounce(fn: Function, delay: number) {
    let timer: any = null
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}