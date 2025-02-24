import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

type Define<Keys extends string[]> = {
  [Key in Keys[number] as `VITE_${Key}`]: string;
};

const defineForEnv = (env: Record<string, string>, keys: string[]) => {
  return keys.reduce<Partial<Define<typeof keys>>>((define, key) => {
    return Object.assign(define, {
      [`VITE_${key}`]: JSON.stringify(env[key]),
    });
  }, {}) as Define<typeof keys>;
};

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, import.meta.dirname, '');

  if (isSsrBuild || 'SSR' in process.env) {
    const keys = ['PORT'];
    const define = defineForEnv(env, keys);

    return {
      build: {
        ssr: true,
        sourcemap: true,
        outDir: 'dist/server',
        emptyOutDir: true,
        rollupOptions: {
          input: 'server/src/index.ts',
        },
      },
      define,
    };
  }

  return {
    plugins: [react()],
    build: {
      sourcemap: true,
      outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: {
        input: 'index.html', // https://github.com/vitejs/vite/issues/19493
      },
    },
    server: {
      proxy: {
        '/api': `http://localhost:${env.PORT}`,
      },
    },
  };
});
