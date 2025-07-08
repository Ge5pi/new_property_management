import express from 'express';
import apiRouter from './api';

const app = express();
const port = process.env.PORT || 8000;

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
