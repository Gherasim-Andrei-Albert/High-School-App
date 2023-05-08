'use strict';
let teachersSampleJSON = require('../sampleData/teachers.json');
let parentsSampleJSON = require('../sampleData/parents.json');
let studentsSampleJSON = require('../sampleData/students.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: Sequelize.QueryTypes.SELECT,
    });

    users.shift();

    let personsDetails = [
      teachersSampleJSON,
      parentsSampleJSON,
      studentsSampleJSON,
    ]
      .flat()
      .map(({ email, ...restOfDetails }) => ({
        ...restOfDetails,
        associatedAccountId: users.shift().id,
      }));

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'PersonDetails',
      personsDetails.map((personDetails) => ({
        ...personDetails,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PersonDetails', null, {});
  },
};
