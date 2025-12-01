'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('presensis', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.addColumn('presensis', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('presensis', 'nama', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('presensis', 'latitude');
    await queryInterface.removeColumn('presensis', 'longitude');
    await queryInterface.changeColumn('presensis', 'nama', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
