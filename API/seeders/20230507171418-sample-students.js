'use strict';
let sampleTeachersJSON = require('../sampleData/teachers.json');
let sampleParentsJSON = require('../sampleData/parents.json');
let sampleStudentsJSON = require('../sampleData/students.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const teachersAccounts = sampleTeachersJSON.map(() => users.shift());
    const parentsAccounts = sampleParentsJSON.map(() => users.shift());
    const studentsAccounts = sampleStudentsJSON.map(() => users.shift());

    const parents = await queryInterface.sequelize.query(
      'SELECT id FROM Parents',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const groups = await queryInterface.sequelize.query(
      'SELECT id, grade FROM `Groups`',
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let sampleStudents = studentsAccounts.map((account, studentIndex) => ({
      parentId: parents.shift().id,
      groupId: groups[Math.trunc(studentIndex / 30)].id,
      accountId: account.id,
      enrolmentYear: 2022,
      grade: groups[Math.trunc(studentIndex / 30)].grade,
    }));

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Students',
      sampleStudents.map((student) => ({
        ...student,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', null, {});
  },
};
