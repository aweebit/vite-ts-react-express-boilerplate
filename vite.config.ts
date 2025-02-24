import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import envConfig from './env.ts';

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => {
  const plugins: PluginOption[] = [ValidateEnv()];

  if (isSsrBuild || 'SSR' in process.env) {
    return {
      plugins,
      build: {
        ssr: true,
        sourcemap: true,
        outDir: 'dist/server',
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
        '/api': `http://localhost:${PORT}`,
      },
    },
  };
});
