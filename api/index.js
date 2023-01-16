/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
const app = new Hono()

app.get('/', (ctx) => {
  return ctx.json({
    endpoint: 'leaderboard',
    description: 'Lista de objetos leaderboard'
  })
})
app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})
app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})
app.get('/presidents/:id', (ctx) => {
  const foundPresident = presidents.find((p) => p.id === ctx.req.param('id'))
  return ctx.json(
    foundPresident || { message: 'President not found', error: 404 }
  )
})
app.get('/teams', (ctx) => {
  return ctx.json(teams)
})
app.get('/static/*', serveStatic({ root: './' }))

export default app

// export default {
//     async fetch(request, env, ctx) {
//         return new Response(JSON.stringify(leaderboard), {
//             headers: {
//                 'Content-Type': 'application/json;charset=UTF-8',
//             },
//         });
//     },
// };
