import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.NUMBER,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        zip_code: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Recipient;
