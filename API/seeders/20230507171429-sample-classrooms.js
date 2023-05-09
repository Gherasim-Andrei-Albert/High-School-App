'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const groups = await queryInterface.sequelize.query(
      'SELECT id, grade, name FROM `Groups`',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const nrOfGrades = 4;
    const nrOfGroupsPerGrade = 4;
    const nrOfClassrooms = nrOfGrades * nrOfGroupsPerGrade;

    let classrooms = [...Array(nrOfClassrooms).keys()].map(
      (classroomIndex) => ({
        ownerGroupId: groups.find(
          (group) =>
            group.grade - 9 ===
              Math.trunc(classroomIndex / nrOfGroupsPerGrade) &&
            group.name ===
              ['A', 'B', 'C', 'D'][classroomIndex % nrOfGroupsPerGrade]
        ).id,
        floor: Math.trunc(classroomIndex / nrOfGroupsPerGrade),
        name: ['A', 'B', 'C', 'D'][classroomIndex % nrOfGroupsPerGrade],
      })
    );

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Classrooms',
      classrooms.map((classroom) => ({
        ...classroom,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Classrooms', null, {});
  },
};
