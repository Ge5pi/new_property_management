import express from 'express';
import corsMiddleware from './middleware/cors.middleware';
import apiRouter from './api';
import roleRouter from './modules/role/role.router';

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use('/api', apiRouter);
app.use('/api/roles', roleRouter);

export default app;
