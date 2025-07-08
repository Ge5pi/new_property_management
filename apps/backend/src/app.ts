import express from 'express';
import cors from 'cors';
import apiRouter from './api';

const app = express();

// Enable CORS for all origins and handle preflight requests
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use('/api', apiRouter);

export default app;
