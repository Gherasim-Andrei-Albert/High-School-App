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

    const admin = users.shift();
    const teachersAccounts = sampleTeachersJSON.map(() => users.shift());
    const parents = sampleParentsJSON.map(({ email, ...personDetails }) => ({
      ...personDetails,
      accountId: users.shift().id,
    }));
    const studentsAccounts = sampleStudentsJSON.map(() => users.shift());

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Parents',
      parents.map((parent) => ({
        ...parent,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parents', null, {});
  },
};
