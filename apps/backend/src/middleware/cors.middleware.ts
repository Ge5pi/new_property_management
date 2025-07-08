import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'withcredentials'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
