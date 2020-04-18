import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import { Request, Response } from 'express';

class RecipientController {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .positive()
        .required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.mixed().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failure' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const recipient = await Recipient.findByPk(id, {});

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    await Recipient.destroy({ where: { id } });

    return res.json({ success: 'recipient deleted', recipient });
  }

  async update(req: Request, res: Response) {
    export const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    const body = req.body;
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const id = req.params.id;

    let recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res
        .status(400)
        .json({ error: `No recipient with id ${recipient_id} was found.` });
    }

    try {
      recipient = await Recipient.update(req.body, { where: { id } });
      return res.json(recipient);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
}

export default new RecipientController();
