'use strict';
let sampleTeachersJSON = require('../sampleData/teachers.json');
let sampleParentsJSON = require('../sampleData/parents.json');
let sampleStudentsJSON = require('../sampleData/students.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const admin = users.shift();
    const teachersAccounts = sampleTeachersJSON.map(() => users.shift());
    const parentsAccounts = sampleParentsJSON.map(() => users.shift());
    const students = sampleStudentsJSON.map(
      ({ email, ...personDetails }, studentIndex) => ({
        ...personDetails,
        accountId: users.shift().id,
        parentId: parents.shift().id,
        groupId: groups[Math.trunc(studentIndex / 30)].id,
        enrolmentYear: 2022,
        grade: groups[Math.trunc(studentIndex / 30)].grade,
      })
    );

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Students',
      students.map((student) => ({
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
