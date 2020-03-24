import Delivery from '../models/Delivery';

class FinishDeliveryController {
  async store(req, res) {
    const { delivery_id } = req.params;
    const current_time = new Date();

    let delivery = Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res
        .status(400)
        .json({ error: `Delivery with id ${delivery_id} not found` });
    }

    if (!delivery.star_date) {
      return res
        .status(400)
        .json({
          error: 'Product not retrieved yet. Impossible to finish delivery',
        });
    }
    if (delivery.end_date)
      return res.status(400).json({
        error: `Delivery with id ${delivery_id} has been already delivered`,
      });

    await Delivery.update(
      { end_date: current_time },
      { where: { id: delivery_id } }
    );

    delivery = await Delivery.findByPk(delivery_id);

    return res.json(delivery);
  }
}

export default new FinishDeliveryController();
