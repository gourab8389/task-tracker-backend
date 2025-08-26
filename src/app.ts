import express from "express";
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';

const app = express();

app.use(cors());
app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);


app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// app.use(notFound);


export default app;
