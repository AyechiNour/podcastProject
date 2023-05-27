'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelizeMetaUser, DataTypes) => {
  class metauser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  metauser.init({
    id: {
      type: DataTypes.BIGINT(60),
      autoIncrement: true,
      primaryKey: true
    },
    metakey: DataTypes.STRING,
    metavalue: DataTypes.STRING,
    idUser: DataTypes.BIGINT(60)
  }, {
    sequelize: sequelizeMetaUser,
    modelName: 'metauser',
  });

  return metauser;
};