'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      teacherId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      classroomId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      academicYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      weekday: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      startTime: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      endTime: {
        allowNull: false,
        type: Sequelize.TIME,
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
    await queryInterface.addConstraint('Lessons', {
      fields: ['subjectId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Subjects',
      references: {
        table: 'Subjects',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['teacherId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Teachers',
      references: {
        table: 'Teachers',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['groupId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Groups',
      references: {
        table: 'Groups',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('Lessons', {
      fields: ['classroomId'],
      type: 'FOREIGN KEY',
      name: 'FK_Lessons_Classrooms',
      references: {
        table: 'Classrooms',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lessons');
  },
};
