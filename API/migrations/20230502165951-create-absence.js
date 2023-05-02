'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Absences', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Absences', {
      fields: ['lessonId'],
      type: 'FOREIGN KEY',
      name: 'FK_Absences_Lessons',
      references: {
        table: 'Lessons',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Absences', {
      fields: ['studentId'],
      type: 'FOREIGN KEY',
      name: 'FK_Absences_Students',
      references: {
        table: 'Students',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Absences');
  },
};
