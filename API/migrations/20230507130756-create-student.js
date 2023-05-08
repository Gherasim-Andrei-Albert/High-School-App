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
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
      },
      enrolmentYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      grade: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.addConstraint('Students', {
      fields: ['accountId'],
      type: 'FOREIGN KEY',
      name: 'FK_Students_Users',
      references: {
        table: 'Users',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  },
};
