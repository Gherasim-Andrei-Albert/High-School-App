'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PersonDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      associatedAccountId: {
        type: Sequelize.INTEGER,
      },
      firstName: {
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        type: Sequelize.STRING,
      },
      phone: {
        validate: {
          notEmpty: true,
        },
        type: Sequelize.STRING,
      },
      address: {
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
    await queryInterface.addConstraint('PersonDetails', {
      fields: ['associatedAccountId'],
      type: 'FOREIGN KEY',
      name: 'FK_PersonDetails_Users',
      references: {
        table: 'Users',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PersonDetails');
  },
};
