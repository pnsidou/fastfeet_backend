import Problem from '../models/Problem';
import Delivery from '../models/Delivery';

class CancelController {
  async delete(req, res) {
    const { problem_id } = req.params;

    const problem = await Problem.findByPk(problem_id);

    const delivery_id = problem.delivery_id;

    const { cancelled_at } = await Delivery.findByPk(delivery_id);

    if (cancelled_at) {
      return res
        .status(400)
        .json({ error: `Delivery ${delivery_id} already cancelled` });
    }

    await Delivery.update(
      { cancelled_at: new Date() },
      { where: { id: delivery_id } }
    );

    const updatedDelivery = await Delivery.findByPk(delivery_id, {
      attributes: ['id', 'product', 'start_date', 'cancelled_at'],
    });

    return res.json({ problem, delivery: updatedDelivery });
  }
}

export default new CancelController();
