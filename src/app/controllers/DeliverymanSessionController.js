import { Request, Response } from 'express';

import Deliveryman from '../models/Deliveryman';

class DeliverymanSessionController {
  async index(req: Request, res: Response) {
    try {
      const deliveryman_id = req.params.id;

      const deliveryman = await Deliveryman.findByPk(deliveryman_id);

      if (!deliveryman)
        return res.status(404).json({ error: 'Deliveryman not found' });

      return res.json(deliveryman);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new DeliverymanSessionController();
