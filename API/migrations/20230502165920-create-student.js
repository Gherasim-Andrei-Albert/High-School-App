'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      parentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      enrolmentDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      grade: {
        allowNull: false,
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
      email: {
        validate: {
          notEmpty: true,
        },
        type: Sequelize.STRING,
      },
      address: {
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
    await queryInterface.addConstraint('Students', {
      fields: ['parentId'],
      type: 'FOREIGN KEY',
      name: 'FK_Students_Parents',
      references: {
        table: 'Parents',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Students', {
      fields: ['groupId'],
      type: 'FOREIGN KEY',
      name: 'FK_Students_Groups',
      references: {
        table: 'Groups',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  },
};
