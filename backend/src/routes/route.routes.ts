import { Router, Request, Response, NextFunction } from 'express';
import Destination from '../models/Destination';
import { calculateRoute } from '../services/openroute.service';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await Destination.findAll({
      order: [['sortOrder', 'ASC']],
    });

    const result = await calculateRoute(
      destinations.map((d) => ({
        name: d.name,
        latitude: d.latitude,
        longitude: d.longitude,
      })),
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
