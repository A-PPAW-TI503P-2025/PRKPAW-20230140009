'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SensorLog extends Model {
    static associate(models) {
      // define association here (jika ada relasi dengan tabel lain)
    }
  }
  
  SensorLog.init({
    suhu: DataTypes.FLOAT,
    kelembaban: DataTypes.FLOAT,
    cahaya: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SensorLog',
    tableName: 'sensorlogs', // WAJIB: Sesuai dengan nama di MySQL
    timestamps: true,        // Mengelola createdAt dan updatedAt secara otomatis
  });
  
  return SensorLog;
};