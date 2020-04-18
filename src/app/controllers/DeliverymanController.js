import * as Yup from 'yup';
import { Request, Response } from 'express';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req: Request, res: Response) {
    try {
      const deliverymen = await Deliveryman.findAll({
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
        attributes: ['id', 'name', 'email'],
      });

      return res.json(deliverymen);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req: Request, res: Response) {
    const body = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const deliveryman_id = req.params.id;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ error: `No deliveryman with id ${deliveryman_id} was found.` });
    }

    if (email && email !== deliveryman.email) {
      const emailCollision = await Deliveryman.findOne({ where: { email } });

      if (emailCollision) {
        return res
          .status(400)
          .json({ error: 'Email already registered in the database' });
      }
    }

    await deliveryman.update(req.body);

    const { id, name, avatar } = await Deliveryman.findByPk(deliveryman_id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async delete(req: Request, res: Response) {
    const deliveryman_id = req.params.id;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({
        error: `Deliveryman with id ${deliveryman_id} does not exist`,
      });
    }

    Deliveryman.destroy({ where: { id: deliveryman_id } });

    const { id, name, email } = deliveryman;

    return res.json({ deleted: { id, name, email } });
  }
}

export default new DeliverymanController();
