import { createApp } from './app.js';

const app = createApp();
const port = parseInt(process.env.PORT ?? '3000', 10);

app.listen(port, () => {
  console.log(`Rate limiter API running on http://localhost:${port}`);
});
