'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      masterTeacherId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      academicYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      grade: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Groups', {
      fields: ['masterTeacherId'],
      type: 'FOREIGN KEY',
      name: 'FK_Groups_Teachers',
      references: {
        table: 'Teachers',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groups');
  },
};
