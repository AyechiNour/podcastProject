'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConvertedArticle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  ConvertedArticle.init({
    id: {
      type: DataTypes.BIGINT(60),
      autoIncrement: true,
      primaryKey:true
    },
    subject: DataTypes.STRING,
    content: DataTypes.TEXT('long'),
    status: DataTypes.BOOLEAN,
    idUser: DataTypes.BIGINT(60)
  }, {
    sequelize,
    modelName: 'ConvertedArticle',
  });
  
  return ConvertedArticle;
};