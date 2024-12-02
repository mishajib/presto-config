const {DataTypes, Sequelize} = require('sequelize');
const sequelize              = require('../utils/database');

const Configuration = sequelize.define('Configuration', {
  product: DataTypes.STRING,
  installationType: DataTypes.STRING,
  dimensions: DataTypes.JSON,
  color: DataTypes.STRING,
  led: DataTypes.STRING,
  service: DataTypes.BOOLEAN,
  branch: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
}, {
  tableName: 'configurations',
});

module.exports = Configuration;