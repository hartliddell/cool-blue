import express from 'express';

import Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

// or using CommonJS
// const express = require('express');
// const Sentry = require('@sentry/node');
// const Tracing = require("@sentry/tracing");

const app = express();

Sentry.init({
  dsn: "https://6677d262ab114bf5a1c5bf7a35f7bcd7@o550327.ingest.sentry.io/5673800",
  environment: process.env.NODE_ENV,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/error', () => {
  throw new Error('oh no. an error!');
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));