import * as Yup from 'yup';
import {
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

const first_hour = setSeconds(setMinutes(setHours(new Date(), 8), 0), 0);
const last_hour = setSeconds(setMinutes(setHours(new Date(), 18), 0), 0);

import Delivery from '../models/Delivery';

class StartDeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Input validation failed' });
    }

    const { deliveryman: deliveryman_id } = req.body;
    const current_time = new Date();
    const { delivery_id } = req.params;

    let delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res
        .status(400)
        .json({ error: `No delivery with id ${delivery_id} found` });
    }

    if (delivery.start_date) {
      return res
        .status(400)
        .json({ error: 'Delivery has been already retrieved' });
    }

    if (isBefore(current_time, first_hour)) {
      return res.status(400).json({
        error: `Product retrieval must be made after ${first_hour.getHours()}:00`,
      });
    }

    if (isAfter(current_time, last_hour)) {
      return res.status(400).json({
        error: `Product retrieval must be made before ${last_hour.getHours()}:00`,
      });
    }

    const days_deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(current_time), endOfDay(current_time)],
        },
      },
    });

    if (days_deliveries && days_deliveries.length >= 5) {
      return res.status(400).json({
        error: 'Deliveryman has already retrieved 5 products for today',
      });
    }

    await Delivery.update(
      { start_date: current_time },
      { where: { id: delivery_id } }
    );

    delivery = await Delivery.findByPk(delivery_id);

    return res.json(delivery);
  }
}

export default new StartDeliveryController();
