if (!/^\d+$/.test(VITE_PORT)) {
  throw new Error('PORT must be a positive integer');
}

export const PORT = Number(VITE_PORT);
