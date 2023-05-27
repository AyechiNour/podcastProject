'use strict';
const { Model } = require('sequelize');
module.exports = (sequelizeUser, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    id: {
      type: DataTypes.BIGINT(60),
      autoIncrement: true,
      primaryKey: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize: sequelizeUser,
    modelName: 'user',
  });
  
  return user;
};