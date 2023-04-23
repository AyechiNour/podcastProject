'use strict';
const {Model} = require('sequelize');
// const article = require("../../article/models/article")
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.metauser, {foreignKey: 'idUser'});
      // user.hasMany(article, {foreignKey: 'idUser'});
    }
  }
  user.init({
    id: {
      type: DataTypes.BIGINT(60),
      autoIncrement: true,
      primaryKey:true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};