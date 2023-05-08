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

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Parents',
      parentsAccounts.map((account) => ({
        accountId: account.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parents', null, {});
  },
};
