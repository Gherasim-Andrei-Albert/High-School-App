'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const nrOfGrades = 4;
    const nrOfGroupsPerGrade = 4;
    const groups = [...Array(nrOfGrades * nrOfGroupsPerGrade).keys()].map(
      (groupIndex) => ({
        masterTeacherId: teachers.shift().id,
        grade: 9 + Math.trunc(groupIndex / 4),
        name: ['A', 'B', 'C', 'D'][groupIndex % 4],
        academicYear: 2022,
      })
    );

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Groups',
      groups.map((group) => ({
        ...group,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
  },
};
