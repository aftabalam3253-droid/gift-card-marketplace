import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db';
import cardRoutes from './routes/card.routes';
import authRoutes from './routes/auth.routes'; // Auth routes import kiye
import adminRoutes from './routes/admin.routes';




dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/gift-cards', cardRoutes);

// API Routes
app.use('/api/auth', authRoutes); // Auth routes yahan mount kiye gaye hain

app.get('/', (req: Request, res: Response) => {
  res.send('Gift Card API is running smoothly with TypeScript & PostgreSQL');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Routes connection
app.use('/api/admin', adminRoutes);