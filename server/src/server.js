import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import mongoose from 'mongoose';

import bookingsRouter from './routes/bookings.js';

const app = express();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
app.use(pinoHttp({ logger }));

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/bookings', bookingsRouter);

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kaamkarlo';
mongoose
  .connect(mongoUri, { dbName: process.env.MONGODB_DB || 'kaamkarlo' })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => {
    logger.error({ err }, 'Failed to connect to MongoDB. Continuing without DB (memory mode).');
  });

const port = Number(process.env.PORT || 4000);
app.listen(port, '0.0.0.0', () => {
  logger.info(`Server listening on port ${port}`);
});


