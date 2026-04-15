import { Request, Response, NextFunction } from 'express';
import Destination from '../models/Destination';
import { AppError } from '../middlewares/error-handler';
import { validationResult } from 'express-validator';

function handleValidation(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(400, errors.array().map((e) => e.msg).join('; '));
  }
}

export async function listDestinations(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const destinations = await Destination.findAll({
      order: [['sortOrder', 'ASC']],
    });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
}

export async function createDestination(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    handleValidation(req);
    const { name, latitude, longitude } = req.body;

    const maxOrder = await Destination.max<number, Destination>('sortOrder');
    const sortOrder = (maxOrder ?? -1) + 1;

    const destination = await Destination.create({
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      sortOrder,
    });

    res.status(201).json(destination);
  } catch (err) {
    next(err);
  }
}

export async function updateDestination(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    handleValidation(req);
    const id = Number(req.params.id);
    const { name, latitude, longitude } = req.body;

    const destination = await Destination.findByPk(id);
    if (!destination) {
      throw new AppError(404, 'Destino não encontrado');
    }

    await destination.update({
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    res.json(destination);
  } catch (err) {
    next(err);
  }
}

export async function deleteDestination(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const destination = await Destination.findByPk(id);
    if (!destination) {
      throw new AppError(404, 'Destino não encontrado');
    }

    const deletedOrder = destination.sortOrder;
    await destination.destroy();

    // Re-index subsequent items
    await Destination.increment(
      { sortOrder: -1 },
      { where: { sortOrder: { [require('sequelize').Op.gt]: deletedOrder } } },
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function reorderDestinations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new AppError(400, 'orderedIds deve ser um array não-vazio de IDs');
    }

    const updates = orderedIds.map((id: number, index: number) =>
      Destination.update({ sortOrder: index }, { where: { id } }),
    );

    await Promise.all(updates);

    const destinations = await Destination.findAll({
      order: [['sortOrder', 'ASC']],
    });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
}
