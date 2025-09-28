/// <reference lib="webworker" />

const CACHE_LIMIT = 300_000;
const ITER_LIMIT = 1_000_000;

const cache: bigint[] = [0n, 1n, 0n, 1n];

addEventListener('message', ({ data }) => {
  const n: number = data;

  try {
    let result: bigint | undefined;

    if (n > ITER_LIMIT) {
      postMessage({ tooBig: true });
      return;
    }

    if (n <= CACHE_LIMIT) {
      result = getValueWithCache(n);
    } else {
      result = continueSequence(n);
    }

    if (result === undefined || result === null) {
      throw new Error('Unexpected Error');
    }

    postMessage({ value: result.toString(), tooBig: false });
  } catch (err: unknown) {
    postMessage({
      error: true,
      message: err instanceof Error ? err.message : 'Unexpected Error',
    });
  }
});

export function getValueWithCache(n: number): bigint {
  if (n < cache.length) return cache[n];

  for (let i = cache.length; i <= n; i++) {
    cache[i] = cache[i - 4] + cache[i - 3];
  }
  return cache[n];
}

export function continueSequence(n: number): bigint {
  let a = cache[cache.length - 4];
  let b = cache[cache.length - 3];
  let c = cache[cache.length - 2];
  let d = cache[cache.length - 1];
  let value = 0n;

  for (let i = cache.length; i <= n; i++) {
    value = a + b;
    a = b;
    b = c;
    c = d;
    d = value;
  }

  return d;
}
