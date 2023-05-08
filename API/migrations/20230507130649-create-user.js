'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isAdmin: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      email: {
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
        type: Sequelize.STRING,
      },
      hashedPassword: {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
