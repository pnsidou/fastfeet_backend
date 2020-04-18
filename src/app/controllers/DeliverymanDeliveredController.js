import { Request, Response } from 'express';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliverymanDeliveredController {
  async index(req: Request, res: Response) {
    try {
      const deliveryman_id = Number(req.params.id);

      const onlyDelivered = { deliveryman_id, end_date: { [Op.not]: null } };

      const deliveries = await Delivery.findAll({
        where: onlyDelivered,
        include: {
          model: Recipient,
          as: 'recipient',
          foreign_key: 'recipient_id',
        },
      });

      return res.json(deliveries);
    } catch (error) {
      return res.status(500).json({ error });
    }
    c;
  }
}

export default new DeliverymanDeliveredController();
