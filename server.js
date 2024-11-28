import { JSONFilePreset } from 'lowdb/node'
import express from 'express';

const app = express();
const port = 3000;

const defaultData = { promocodes: [] }
const db = await JSONFilePreset('/data/db.json', defaultData)

app.get('/new-promocode', async (_req, res) => {
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
});
