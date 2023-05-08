'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const subjects = await queryInterface.sequelize.query(
      'SELECT id, name FROM Subjects',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const multiSpecialisedTeacher = teachers.pop();

    const assignments = subjects
      .map((subject) => [
        {
          subjectId: subject.id,
          teacherId: ['Literatură', 'Engleză', 'Germană'].includes(subject.name)
            ? multiSpecialisedTeacher.id
            : teachers.shift().id,
        },
        ...[...Array(3).keys()].map(() => ({
          subjectId: subject.id,
          teacherId: teachers.shift().id,
        })),
      ])
      .flat();

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'TeacherSubjectAssignments',
      assignments.map((assignment) => ({
        ...assignment,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TeacherSubjectAssignments', null, {});
  },
};
