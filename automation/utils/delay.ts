export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomDelay(min: number, max: number) {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return delay(ms);
}
