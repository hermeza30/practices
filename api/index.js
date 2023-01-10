/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable semi */
import leaderboard from '../db/leaderboard.json';
import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
const app = new Hono();

app.get('/', (ctx) => {
    return ctx.json({
        endpoint: 'leaderboard',
        description: 'Lista de objetos leaderboard',
    });
});
app.get('/leaderboard', (ctx) => {
    return ctx.json(leaderboard);
});
app.get('/static/*', serveStatic({ root: './' }));

export default app;

// export default {
//     async fetch(request, env, ctx) {
//         return new Response(JSON.stringify(leaderboard), {
//             headers: {
//                 'Content-Type': 'application/json;charset=UTF-8',
//             },
//         });
//     },
// };
