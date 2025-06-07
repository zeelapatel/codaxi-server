'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Projects', 'generatedApiDocs', {
      type: Sequelize.JSONB,
      allowNull: true, // Can be null initially
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'generatedApiDocs');
  }
}; 