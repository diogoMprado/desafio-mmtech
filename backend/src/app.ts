import express from 'express';
import cors from 'cors';
import destinationRoutes from './routes/destination.routes';
import routeRoutes from './routes/route.routes';
import geocodeRoutes from './routes/geocode.routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/geocode', geocodeRoutes);

app.use(errorHandler);

export default app;
