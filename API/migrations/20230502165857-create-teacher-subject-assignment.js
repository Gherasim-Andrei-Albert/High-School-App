'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TeacherSubjectAssignments', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('TeacherSubjectAssignments', {
      fields: ['teacherId'],
      type: 'FOREIGN KEY',
      name: 'FK_TeacherSubjectAssignments_Teachers',
      references: {
        table: 'Teachers',
        field: 'id',
      },
    });
    await queryInterface.addConstraint('TeacherSubjectAssignments', {
      fields: ['subjectId'],
      type: 'FOREIGN KEY',
      name: 'FK_TeacherSubjectAssignments_Subjects',
      references: {
        table: 'Subjects',
        field: 'id',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TeacherSubjectAssignments');
  },
};
