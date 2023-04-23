'use strict';
const {
  Model
} = require('sequelize');
const user = require("../../user/models").user
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Article.init({
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
    modelName: 'Article',
  });
  return Article;
};