export function randomRange(num1: number, num2?: number) {
    if (!num2) return Math.floor(Math.random() * num1);
    return Math.floor(Math.random() * ((num2 ?? 0) - num1) + num1);
}