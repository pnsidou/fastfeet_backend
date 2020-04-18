import * as Yup from 'yup';
import { Request, Response } from 'express';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import { createOptions, Sequelize, Op } from 'sequelize';

const schema = Yup.object().shape({
  product: Yup.string().required(),
  recipient_id: Yup.number()
    .integer()
    .required(),
  deliveryman_id: Yup.number()
    .integer()
    .required(),
});

const attributes = [
  'id',
  'product',
  'cancelled_at',
  'start_date',
  'end_date',
  'status',
];

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
    attributes: ['id', 'url'],
  },
];

class DeliveryController {
  async index(req, res) {
    const { q: query } = req.params;
    const where = query ? { name: { [Op.iLike]: '%' + query + '%' } } : null;

    console.log('delivery controller', where);
    const deliveries = await Delivery.findAll({ where, include, attributes });
    console.log('dleiveries');
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

    try {
      const response = await Delivery.destroy({ where: { id } });

      return res.json({ deleted: delivery });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

export default new DeliveryController();
