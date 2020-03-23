import * as Yup from 'yup';
import { Request, Response } from 'express';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import { createOptions, Sequelize } from 'sequelize';

const schema = Yup.object().shape({
  product: Yup.string().required(),
  recipient_id: Yup.number().required(),
  deliveryman_id: Yup.number().required(),
});

const attributes = ['product', 'cancelled_at', 'start_date', 'end_date'];

const include = [
  {
    model: Recipient,
    as: 'recipient',
    attributes: ['id', 'name', 'street', 'number', 'city', 'state', 'zip_code'],
  },
  {
    model: Deliveryman,
    as: 'deliveryman',
    attributes: ['id', 'name', 'email'],
    include: {
      model: File,
      as: 'avatar',
      attributes: ['id', 'url'],
    },
  },
  {
    model: File,
    as: 'signature',
    attributes: ['id', 'name', 'url'],
  },
];

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({ include, attributes });

    return res.json(deliveries);
  }

  async store(req: Request, res: Response) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Input validation failed' });
    }

    const { id } = await Delivery.create(req.body);

    const { product, recipient, deliveryman } = await Delivery.findByPk(id, {
      include,
    });

    return res.json({
      id,
      product,
      recipient,
      deliveryman,
    });
  }

  async update(req: Request, res: Response) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Input validation failed' });
    }

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'No delivery id supplied' });
    }

    await Delivery.update(req.body, { where: { id }, include, attributes });

    const { product, recipient, deliveryman } = await Delivery.findByPk(id, {
      include,
      attributes,
    });

    return res.json({
      id,
      product,
      recipient,
      deliveryman,
    });
  }

  async delete(req, res) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: 'No delivery id supplied' });
    }

    const delivery = await Delivery.findByPk(id, { include, attributes });

    if (!delivery) {
      return res
        .status(400)
        .json({ error: `Delivery with id ${id} does not exist` });
    }

    Delivery.destroy({ where: { id } });

    return res.json({ deleted: delivery });
  }
}

export default new DeliveryController();
