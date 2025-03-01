import express from 'express';
import { join } from 'node:path';
import { PORT } from './global.ts';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(import.meta.dirname, '../../client')));
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    server.close();
  });
}
