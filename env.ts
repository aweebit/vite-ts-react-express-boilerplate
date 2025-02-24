import { defineConfig } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  VITE_PORT: (key, value) => {
    if (value && /^\d+$/.test(value)) {
      const result = Number(value);
      if (result !== 0) return result;
    }

    throw new Error(`${key} must be a positive integer`);
  },
});
