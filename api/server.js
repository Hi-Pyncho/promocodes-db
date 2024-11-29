import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'fs';

import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { Eta } from 'eta'
import { JSONFilePreset } from 'lowdb/node'
import { json } from 'milliparsec'
import sirv from 'sirv'

const port = 8080;

const db = await JSONFilePreset(join('db.json'), { promocodes: [] });

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env['NODE_ENV'] === 'production'

const eta = new Eta({
  views: join(__dirname, 'public'),
  cache: isProduction,
})

const app = new App()
app.use(sirv('public', { dev: !isProduction }))

app.use((req, res, next) => {
  return cors({
    allowedHeaders: req.headers['access-control-request-headers']
      ?.split(',')
      .map((h) => h.trim()),
  })(req, res, next)
}).options('*', cors())

app.use(json())

app.get('/', (_req, res) =>
  res.send(eta.render('index.html', { data: db.data })),
)

app.get('new-promocode', async (_req, res) => {
  const promocode = db.data.promocodes.pop();
  await db.write();

  if (!promocode) {
    res.status(404);
    res.end();
    return;
  }

  res.json(promocode);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
