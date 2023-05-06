'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Marks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lessonId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      studentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      value: {
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
    await queryInterface.addConstraint('Marks', {
      fields: ['lessonId'],
      type: 'FOREIGN KEY',
      name: 'FK_Marks_Lessons',
      references: {
        table: 'Lessons',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Marks', {
      fields: ['studentId'],
      type: 'FOREIGN KEY',
      name: 'FK_Marks_Students',
      references: {
        table: 'Students',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Marks');
  },
};
