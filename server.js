const express = require('express');

const app = express();
const port = 3000;

init();

async function init() {
  const lowdb = await import('lowdb/node');

  const db = await lowdb.JSONFilePreset('db.json', { promocodes: [] });

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
}
