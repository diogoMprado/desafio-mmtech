import { Router, Request, Response, NextFunction } from 'express';
import { geocodeSearch } from '../services/openroute.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    const results = await geocodeSearch(query || '');
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;
