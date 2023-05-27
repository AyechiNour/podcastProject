'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const articleConfig = config.dbArticle;
const convertedArticleConfig = config.dbConvertedArticle;

let sequelizeArticle;
let sequelizeConvertedArticle;

if (articleConfig.use_env_variable) {
  sequelizeArticle = new Sequelize(process.env[articleConfig.use_env_variable], articleConfig);
} else {
  sequelizeArticle = new Sequelize(articleConfig.database, articleConfig.username, articleConfig.password, articleConfig);
}

if (convertedArticleConfig.use_env_variable) {
  sequelizeConvertedArticle = new Sequelize(process.env[convertedArticleConfig.use_env_variable], convertedArticleConfig);
} else {
  sequelizeConvertedArticle = new Sequelize(convertedArticleConfig.database, convertedArticleConfig.username, convertedArticleConfig.password, convertedArticleConfig);
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
    if (file == "article.js") {
      const model = require(path.join(__dirname, file))(sequelizeArticle, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      const model = require(path.join(__dirname, file))(sequelizeConvertedArticle, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].articledb && db[modelName].articledb.associate) {
    db[modelName].articledb.associate(db[modelName].articledb);
  }
  if (db[modelName].convertedarticledb && db[modelName].convertedarticledb.associate) {
    db[modelName].convertedarticledb.associate(db[modelName].convertedarticledb);
  }
});

db.sequelizeArticle = sequelizeArticle;
db.sequelizeConvertedArticle = sequelizeConvertedArticle;

module.exports = db;