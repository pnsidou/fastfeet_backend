import Delivery from '../models/Delivery';

import File from '../models/File';

class FinishDeliveryController {
  async store(req, res) {
    const { delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    try {
      const delivery = await Delivery.findByPk(delivery_id);

      if (!delivery) {
        return res
          .status(400)
          .json({ error: `Delivery with id ${delivery_id} not found` });
      }

      if (!delivery.start_date) {
        return res.status(400).json({
          error: 'Product not retrieved yet. Impossible to finish delivery',
        });
      }
      if (delivery.end_date)
        return res.status(400).json({
          error: `Delivery with id ${delivery_id} has been already delivered`,
        });

      const current_time = new Date();

      const file = await File.create({
        name,
        path,
      });

      await Delivery.update(
        { end_date: current_time, signature_id: file.id },
        { where: { id: delivery_id } }
      );

      delivery = await Delivery.findByPk(delivery_id, {
        include: [{ model: File, as: 'signature', attributes: ['id', 'url'] }],
      });

      return res.json(delivery);
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
  }
}

export default new FinishDeliveryController();
