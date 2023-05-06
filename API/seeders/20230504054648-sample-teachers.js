'use strict';
const bcrypt = require('bcrypt');
let sampleTeachersJSON = require('../sampleData/teachers.json');
const sampleDataConfig = require('../config/sampleDataConfig.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let teachers = await Promise.all(
      sampleTeachersJSON.map(async (teacher) => ({
        ...teacher,
        hashedPassword: await bcrypt.hash(sampleDataConfig.teacherPassword, 10),
      }))
    );

    const currentDate = new Date();
    await queryInterface.bulkInsert(
      'Teachers',
      teachers.map((teacher) => ({
        ...teacher,
        createdAt: currentDate,
        updatedAt: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', null, {});
  },
};
