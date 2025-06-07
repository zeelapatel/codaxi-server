'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'projectContext', {
      type: Sequelize.JSONB,
      allowNull: true, // Can be null initially
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'projectContext');
  }
}; 