'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const userConfig = config.dbUser;
const metaUserConfig = config.dbMetaUser;

let sequelizeUser;
let sequelizeMetaUser;

if (userConfig.use_env_variable) {
  sequelizeUser = new Sequelize(process.env[userConfig.use_env_variable], userConfig);
} else {
  sequelizeUser = new Sequelize(userConfig.database, userConfig.username, userConfig.password, userConfig);
}

if (metaUserConfig.use_env_variable) {
  sequelizeMetaUser = new Sequelize(process.env[metaUserConfig.use_env_variable], metaUserConfig);
} else {
  sequelizeMetaUser = new Sequelize(metaUserConfig.database, metaUserConfig.username, metaUserConfig.password, metaUserConfig);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    if (file=="user.js"){
      const model = require(path.join(__dirname, file))(sequelizeUser, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      const model = require(path.join(__dirname, file))(sequelizeMetaUser, Sequelize.DataTypes);
      db[model.name] = model;
    }   
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].userdb && db[modelName].userdb.associate) {
    db[modelName].userdb.associate(db[modelName].userdb);
  }
  if (db[modelName].metauserdb && db[modelName].metauserdb.associate) {
    db[modelName].metauserdb.associate(db[modelName].metauserdb);
  }
});

db.sequelizeUser = sequelizeUser;
db.sequelizeMetaUser = sequelizeMetaUser;

module.exports = db