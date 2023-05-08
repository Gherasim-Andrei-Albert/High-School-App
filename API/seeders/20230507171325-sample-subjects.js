'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let sampleSubjectsJSON = require('../sampleData/subjects.json');
    sampleSubjectsJSON = sampleSubjectsJSON.map(({ name }) => ({ name }));

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Subjects',
      sampleSubjectsJSON.map((subject) => ({
        ...subject,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Subjects', null, {});
  },
};
