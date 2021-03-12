import express from 'express';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const app = express();

Sentry.init({
  dsn: "https://6677d262ab114bf5a1c5bf7a35f7bcd7@o550327.ingest.sentry.io/5673800",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/error', () => {
  throw new Error('oh no. an error!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));