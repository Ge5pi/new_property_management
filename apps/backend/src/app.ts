import express from 'express';
import cors from 'cors';
import apiRouter from './api';
import roleRouter from './modules/role/role.router';

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: true,
}));

app.options('*', cors());

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api/roles', roleRouter);

export default app;
