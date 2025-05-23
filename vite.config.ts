import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import envConfig from './env';

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const plugins: PluginOption[] = [ValidateEnv()];

  if (isSsrBuild || 'SSR' in process.env) {
    // This should be refactored to have "server" as the "root" after
    // https://github.com/vitest-dev/vitest/issues/7538 is fixed.
    return {
      plugins,
      build: {
        ssr: true,
        sourcemap: true,
        outDir: 'server/dist',
        emptyOutDir: true,
        rollupOptions: {
          input: 'server/src/index.ts',
        },
      },
    };
  }

  plugins.push(react());

  const { VITE_PORT } = loadEnv(mode, import.meta.dirname);
  const PORT = envConfig.VITE_PORT('VITE_PORT', VITE_PORT);

  return {
    plugins,
    root: 'client',
    envDir: '..',
    build: {
      sourcemap: true,
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: 'client/index.html',
      },
    },
    server: {
      proxy: {
        '/api': `http://localhost:${PORT}`,
      },
    },
  };
});
