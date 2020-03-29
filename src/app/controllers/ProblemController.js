import * as Yup from 'yup';

import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

const include = {
  model: Delivery,
  as: 'delivery',
  attributes: ['id', 'start_date', 'end_date'],
};

class ProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Input validation failed' });
    }

    const { delivery_id } = req.params;
    const { description } = req.body;

    const { id } = await Problem.create({ delivery_id, description });

    const problem = await Problem.findByPk(id, { include });

    return res.json(problem);
  }

  async index(req, res) {
    const { delivery_id } = req.params;

    const problems = await Problem.findAll({ where: { delivery_id }, include });

    return res.json({ problems });
  }
}

export default new ProblemController();
